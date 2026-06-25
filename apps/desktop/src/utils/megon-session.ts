import type { Session as LocalSession } from "@/types"
import { nativeApi } from "@/services/native"
import { sessionTitle } from "./session-title"

const FALLBACK_SESSION_TITLE = "New session"
const PLACEHOLDER_SESSION_TITLES = new Set([FALLBACK_SESSION_TITLE, "Terminal"])

export type MegonSessionLike = {
  id: string
  parentID?: string
  title?: string
  time?: {
    created?: number
    updated?: number
    archived?: number
  }
}

export type MegonMessageLike = {
  role?: string
}

export const MegonSessionUpdatedAt = (session: MegonSessionLike) =>
  session.time?.updated ?? session.time?.created ?? 0

export const sortMegonSessionsById = <T extends { id: string }>(sessions: T[]) =>
  [...sessions].sort((left, right) => (left.id < right.id ? -1 : left.id > right.id ? 1 : 0))

export function normalizeMegonSessionTitle(title?: string | null) {
  const normalized = sessionTitle(title ?? undefined)?.trim()
  if (!normalized || PLACEHOLDER_SESSION_TITLES.has(normalized)) return FALLBACK_SESSION_TITLE
  return normalized
}

export function sessionHasUserPrompt(messages: readonly MegonMessageLike[] | undefined) {
  return Boolean(messages?.some((message) => message.role === "user"))
}

export function isKnownEmptyRootMegonSession(
  session: MegonSessionLike,
  messages: readonly MegonMessageLike[] | undefined,
) {
  return !session.parentID && !session.time?.archived && messages !== undefined && !sessionHasUserPrompt(messages)
}

export function findReusableEmptyRootMegonSession<T extends MegonSessionLike>(
  sessions: readonly T[],
  messagesBySessionId: Record<string, readonly MegonMessageLike[] | undefined>,
  preferredSessionId?: string | null,
) {
  const emptySessions = sessions.filter((session) =>
    isKnownEmptyRootMegonSession(session, messagesBySessionId[session.id]),
  )
  const preferred = preferredSessionId
    ? emptySessions.find((session) => session.id === preferredSessionId)
    : undefined
  if (preferred) return preferred

  return [...emptySessions].sort((left, right) => {
    const leftUpdated = MegonSessionUpdatedAt(left)
    const rightUpdated = MegonSessionUpdatedAt(right)
    if (leftUpdated !== rightUpdated) return rightUpdated - leftUpdated
    return left.id < right.id ? 1 : left.id > right.id ? -1 : 0
  })[0]
}

export function toLocalMegonSession(
  session: MegonSessionLike,
  options: { shell?: string | null; pinned?: boolean } = {},
): LocalSession {
  const now = Date.now()
  const createdAt = session.time?.created ?? now
  const lastActiveAt = session.time?.updated ?? createdAt

  return {
    id: session.id,
    name: normalizeMegonSessionTitle(session.title),
    parentSessionId: session.parentID ?? null,
    shell: options.shell ?? nativeApi.defaultShell(),
    cliTool: "megon",
    pendingLaunchCommand: null,
    pinned: options.pinned ?? false,
    createdAt,
    lastActiveAt,
    commandCount: 0,
    startupDurationMs: null,
  }
}
