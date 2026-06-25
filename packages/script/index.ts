import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootPkg = JSON.parse(readFileSync(resolve(__dirname, "../../package.json"), "utf-8"))

const channel = process.env.MEGON_CHANNEL || "latest"

export const Script = {
  version: process.env.MEGON_VERSION || rootPkg.version,
  channel,
  release: process.env.MEGON_RELEASE === "true",
  get preview() {
    return channel === "preview" || channel === "next"
  },
}
