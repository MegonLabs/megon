import MegonLogo from "@/assets/icon/megon.png"

interface IcoProps {
  class?: string
  alt?: string
}

export function Ico(props: IcoProps) {
  return <img src={MegonLogo} alt={props.alt ?? "Megon logo"} class={props.class ?? "h-9 w-9 rounded-lg object-cover"} />
}

