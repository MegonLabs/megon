declare global {
  const MEGON_VERSION: string
  const MEGON_CHANNEL: string
}

export const VERSION = typeof MEGON_VERSION === "string" ? MEGON_VERSION : "local"
export const CHANNEL = typeof MEGON_CHANNEL === "string" ? MEGON_CHANNEL : "local"
