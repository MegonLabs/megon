import { createSignal, onCleanup, onMount } from "solid-js"
import { Portal } from "solid-js/web"
import { useI18n } from "../context/i18n"
import { Icon } from "./icon"

export function FileSearchBar(props: {
  pos: () => { top: number; right: number }
  query: () => string
  index: () => number
  count: () => number
  setInput: (el: HTMLInputElement) => void
  onInput: (value: string) => void
  onKeyDown: (event: KeyboardEvent) => void
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  variant?: "floating" | "sticky"
}) {
  const i18n = useI18n()
  const [dragging, setDragging] = createSignal(false)
  const [offset, setOffset] = createSignal({ x: 0, y: 0 })
  const [position, setPosition] = createSignal({ x: 0, y: 0 })
  let barRef: HTMLDivElement | undefined
  let initialized = false
  const isSticky = () => props.variant === "sticky"

  const initPosition = () => {
    if (initialized || !barRef) return
    initialized = true
    if (isSticky()) {
      setPosition({ x: 0, y: 0 })
    } else {
      const rect = barRef.getBoundingClientRect()
      setPosition({
        x: window.innerWidth - rect.width - 16,
        y: window.innerHeight - rect.height - 16,
      })
    }
  }

  const handlePointerDown = (e: PointerEvent) => {
    if (isSticky() || (e.target as HTMLElement).closest("input, button")) return
    e.preventDefault()
    setDragging(true)
    const rect = barRef!.getBoundingClientRect()
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    barRef!.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: PointerEvent) => {
    if (!dragging()) return
    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - (barRef?.offsetWidth ?? 0), e.clientX - offset().x)),
      y: Math.max(0, Math.min(window.innerHeight - (barRef?.offsetHeight ?? 0), e.clientY - offset().y)),
    })
  }

  const handlePointerUp = () => {
    setDragging(false)
  }

  const barContent = (
    <div
      ref={(el) => { barRef = el; initPosition() }}
      class="flex h-8 items-center gap-2 rounded-md border border-border-base bg-background-base px-3 shadow-md select-none"
      classList={{
        "cursor-grabbing": dragging(),
        "cursor-grab": !dragging() && !isSticky(),
        "w-full": isSticky(),
        "fixed z-50": !isSticky(),
      }}
      style={isSticky() ? {} : {
        left: `${position().x}px`,
        top: `${position().y}px`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Icon name="magnifying-glass" size="small" class="text-text-weak shrink-0" />
      <input
        ref={props.setInput}
        placeholder={i18n.t("ui.fileSearch.placeholder")}
        value={props.query()}
        class="min-w-0 flex-1 bg-transparent outline-none text-14-regular text-text-strong placeholder:text-text-weak"
        onInput={(e) => props.onInput(e.currentTarget.value)}
        onKeyDown={(e) => props.onKeyDown(e as KeyboardEvent)}
      />
      <div class="shrink-0 text-12-regular text-text-weak tabular-nums text-right" style={{ width: "10ch" }}>
        {props.count() ? `${props.index() + 1}/${props.count()}` : "0/0"}
      </div>
      <div class="flex items-center">
        <button
          type="button"
          class="size-6 grid place-items-center rounded text-text-weak hover:bg-surface-base-hover hover:text-text-strong disabled:opacity-40 disabled:pointer-events-none"
          disabled={props.count() === 0}
          aria-label={i18n.t("ui.fileSearch.previousMatch")}
          onClick={props.onPrev}
        >
          <Icon name="chevron-up" size="small" />
        </button>
        <button
          type="button"
          class="size-6 grid place-items-center rounded text-text-weak hover:bg-surface-base-hover hover:text-text-strong disabled:opacity-40 disabled:pointer-events-none"
          disabled={props.count() === 0}
          aria-label={i18n.t("ui.fileSearch.nextMatch")}
          onClick={props.onNext}
        >
          <Icon name="chevron-down" size="small" />
        </button>
      </div>
      <button
        type="button"
        class="size-6 grid place-items-center rounded text-text-weak hover:bg-surface-base-hover hover:text-text-strong"
        aria-label={i18n.t("ui.fileSearch.close")}
        onClick={props.onClose}
      >
        <Icon name="close-small" size="small" />
      </button>
    </div>
  )

  if (isSticky()) return barContent
  return <Portal>{barContent}</Portal>
}
