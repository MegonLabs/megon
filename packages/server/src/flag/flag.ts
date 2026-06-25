import { Config } from "effect"
import { CHANNEL } from "../installation/meta"

function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

function falsy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "false" || value === "0"
}

export namespace Flag {
  export const OTEL_EXPORTER_OTLP_ENDPOINT = process.env["OTEL_EXPORTER_OTLP_ENDPOINT"]
  export const OTEL_EXPORTER_OTLP_HEADERS = process.env["OTEL_EXPORTER_OTLP_HEADERS"]

  export const MEGON_AUTO_SHARE = truthy("MEGON_AUTO_SHARE")
  export const MEGON_AUTO_HEAP_SNAPSHOT = truthy("MEGON_AUTO_HEAP_SNAPSHOT")
  export const MEGON_GIT_BASH_PATH = process.env["MEGON_GIT_BASH_PATH"]
  export const MEGON_CONFIG = process.env["MEGON_CONFIG"]
  export declare const MEGON_PURE: boolean
  export declare const MEGON_TUI_CONFIG: string | undefined
  export declare const MEGON_CONFIG_DIR: string | undefined
  export declare const MEGON_PLUGIN_META_FILE: string | undefined
  export const MEGON_CONFIG_CONTENT = process.env["MEGON_CONFIG_CONTENT"]
  export const MEGON_DISABLE_AUTOUPDATE = truthy("MEGON_DISABLE_AUTOUPDATE")
  export const MEGON_ALWAYS_NOTIFY_UPDATE = truthy("MEGON_ALWAYS_NOTIFY_UPDATE")
  export const MEGON_DISABLE_PRUNE = truthy("MEGON_DISABLE_PRUNE")
  export const MEGON_DISABLE_TERMINAL_TITLE = truthy("MEGON_DISABLE_TERMINAL_TITLE")
  export const MEGON_SHOW_TTFD = truthy("MEGON_SHOW_TTFD")
  export const MEGON_PERMISSION = process.env["MEGON_PERMISSION"]
  export const MEGON_DISABLE_DEFAULT_PLUGINS = truthy("MEGON_DISABLE_DEFAULT_PLUGINS")
  export const MEGON_DISABLE_LSP_DOWNLOAD = truthy("MEGON_DISABLE_LSP_DOWNLOAD")
  export const MEGON_ENABLE_EXPERIMENTAL_MODELS = truthy("MEGON_ENABLE_EXPERIMENTAL_MODELS")
  export const MEGON_DISABLE_AUTOCOMPACT = truthy("MEGON_DISABLE_AUTOCOMPACT")
  export const MEGON_DISABLE_MODELS_FETCH = truthy("MEGON_DISABLE_MODELS_FETCH")
  export const MEGON_DISABLE_MOUSE = truthy("MEGON_DISABLE_MOUSE")
  export const MEGON_DISABLE_CLAUDE_CODE = truthy("MEGON_DISABLE_CLAUDE_CODE")
  export const MEGON_DISABLE_CLAUDE_CODE_PROMPT =
    MEGON_DISABLE_CLAUDE_CODE || truthy("MEGON_DISABLE_CLAUDE_CODE_PROMPT")
  export const MEGON_DISABLE_CLAUDE_CODE_SKILLS =
    MEGON_DISABLE_CLAUDE_CODE || truthy("MEGON_DISABLE_CLAUDE_CODE_SKILLS")
  export const MEGON_DISABLE_EXTERNAL_SKILLS =
    MEGON_DISABLE_CLAUDE_CODE_SKILLS || truthy("MEGON_DISABLE_EXTERNAL_SKILLS")
  export declare const MEGON_DISABLE_PROJECT_CONFIG: boolean
  export const MEGON_FAKE_VCS = process.env["MEGON_FAKE_VCS"]
  export declare const MEGON_CLIENT: string
  export const MEGON_SERVER_PASSWORD = process.env["MEGON_SERVER_PASSWORD"]
  export const MEGON_SERVER_USERNAME = process.env["MEGON_SERVER_USERNAME"]
  export const MEGON_ENABLE_QUESTION_TOOL = truthy("MEGON_ENABLE_QUESTION_TOOL")

  // Experimental — gated to non-production channels only
  export const MEGON_EXPERIMENTAL = CHANNEL !== "latest" && truthy("MEGON_EXPERIMENTAL")
  export const MEGON_EXPERIMENTAL_FILEWATCHER = Config.boolean("MEGON_EXPERIMENTAL_FILEWATCHER").pipe(
    Config.withDefault(false),
  )
  export const MEGON_EXPERIMENTAL_DISABLE_FILEWATCHER = Config.boolean(
    "MEGON_EXPERIMENTAL_DISABLE_FILEWATCHER",
  ).pipe(Config.withDefault(false))
  export const MEGON_EXPERIMENTAL_ICON_DISCOVERY =
    MEGON_EXPERIMENTAL || truthy("MEGON_EXPERIMENTAL_ICON_DISCOVERY")

  const copy = process.env["MEGON_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]
  export const MEGON_EXPERIMENTAL_DISABLE_COPY_ON_SELECT =
    copy === undefined ? process.platform === "win32" : truthy("MEGON_EXPERIMENTAL_DISABLE_COPY_ON_SELECT")
  export const MEGON_ENABLE_EXA =
    truthy("MEGON_ENABLE_EXA") || MEGON_EXPERIMENTAL || truthy("MEGON_EXPERIMENTAL_EXA")
  export const MEGON_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS = number("MEGON_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS")
  export const MEGON_EXPERIMENTAL_OUTPUT_TOKEN_MAX = number("MEGON_EXPERIMENTAL_OUTPUT_TOKEN_MAX")
  export const MEGON_EXPERIMENTAL_OXFMT = MEGON_EXPERIMENTAL || truthy("MEGON_EXPERIMENTAL_OXFMT")
  export const MEGON_EXPERIMENTAL_LSP_TY = truthy("MEGON_EXPERIMENTAL_LSP_TY")
  export const MEGON_EXPERIMENTAL_LSP_TOOL = MEGON_EXPERIMENTAL || truthy("MEGON_EXPERIMENTAL_LSP_TOOL")
  export const MEGON_DISABLE_FILETIME_CHECK = Config.boolean("MEGON_DISABLE_FILETIME_CHECK").pipe(
    Config.withDefault(false),
  )
  export const MEGON_EXPERIMENTAL_PLAN_MODE = MEGON_EXPERIMENTAL || truthy("MEGON_EXPERIMENTAL_PLAN_MODE")
  export const MEGON_EXPERIMENTAL_WORKSPACES = MEGON_EXPERIMENTAL || truthy("MEGON_EXPERIMENTAL_WORKSPACES")
  export const MEGON_EXPERIMENTAL_MARKDOWN = !falsy("MEGON_EXPERIMENTAL_MARKDOWN")
  export const MEGON_MODELS_URL = process.env["MEGON_MODELS_URL"]
  export const MEGON_MODELS_PATH = process.env["MEGON_MODELS_PATH"]
  export const MEGON_DISABLE_EMBEDDED_WEB_UI = truthy("MEGON_DISABLE_EMBEDDED_WEB_UI")
  export const MEGON_DB = process.env["MEGON_DB"]
  export const MEGON_DISABLE_CHANNEL_DB = truthy("MEGON_DISABLE_CHANNEL_DB")
  export const MEGON_SKIP_MIGRATIONS = truthy("MEGON_SKIP_MIGRATIONS")
  export const MEGON_STRICT_CONFIG_DEPS = truthy("MEGON_STRICT_CONFIG_DEPS")

  function number(key: string) {
    const value = process.env[key]
    if (!value) return undefined
    const parsed = Number(value)
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
  }
}

// Dynamic getter for MEGON_DISABLE_PROJECT_CONFIG
// This must be evaluated at access time, not module load time,
// because external tooling may set this env var at runtime
Object.defineProperty(Flag, "MEGON_DISABLE_PROJECT_CONFIG", {
  get() {
    return truthy("MEGON_DISABLE_PROJECT_CONFIG")
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for MEGON_TUI_CONFIG
// This must be evaluated at access time, not module load time,
// because tests and external tooling may set this env var at runtime
Object.defineProperty(Flag, "MEGON_TUI_CONFIG", {
  get() {
    return process.env["MEGON_TUI_CONFIG"]
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for MEGON_CONFIG_DIR
// This must be evaluated at access time, not module load time,
// because external tooling may set this env var at runtime
Object.defineProperty(Flag, "MEGON_CONFIG_DIR", {
  get() {
    return process.env["MEGON_CONFIG_DIR"]
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for MEGON_PURE
// This must be evaluated at access time, not module load time,
// because the CLI can set this flag at runtime
Object.defineProperty(Flag, "MEGON_PURE", {
  get() {
    return truthy("MEGON_PURE")
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for MEGON_PLUGIN_META_FILE
// This must be evaluated at access time, not module load time,
// because tests and external tooling may set this env var at runtime
Object.defineProperty(Flag, "MEGON_PLUGIN_META_FILE", {
  get() {
    return process.env["MEGON_PLUGIN_META_FILE"]
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for MEGON_CLIENT
// This must be evaluated at access time, not module load time,
// because some commands override the client at runtime
Object.defineProperty(Flag, "MEGON_CLIENT", {
  get() {
    return process.env["MEGON_CLIENT"] ?? "cli"
  },
  enumerable: true,
  configurable: false,
})
