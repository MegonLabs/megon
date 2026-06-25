# MEGON Rebrand — Change Log

## Summary
Complete white-label rebrand from "Shob" to "Megon" across the entire codebase.

---

## Phase 1: Package Names & Manifests
- [x] `package.json` — `shob-monorepo` → `megon-monorepo`, scripts updated, author → `MegonLabs`
- [x] `apps/desktop/package.json` — `shob-desktop` → `megon-desktop`, deps `@shob-ai/*` → `@megon/*`, appId → `app.megon.desktop`, productName → `Megon`, owner → `MegonLabs`, repo → `megon`
- [x] `apps/shob-code/package.json` → `apps/megon/package.json` — `shob-code` → `megon`, bin `shob` → `megon`
- [x] `packages/server/package.json` — `@shob-ai/server` → `@megon/server`, bin `shob` → `megon`
- [x] `packages/sdk/js/package.json` — `@shob-ai/sdk` → `@megon/sdk`
- [x] `packages/ui/package.json` — `@shob-ai/ui` → `@megon/ui`, deps updated
- [x] `packages/util/package.json` — `@shob-ai/util` → `@megon/util`
- [x] `packages/plugin/package.json` — `@shob-ai/plugin` → `@megon/plugin`, deps updated

## Phase 2: Version Reset
- [x] All 8 packages version → `0.0.1`

## Phase 3: Directory Renames
- [x] `apps/shob-code/` → `apps/megon/`
- [x] `apps/desktop/src/shob-ported/` → `apps/desktop/src/megon-ported/`
- [x] `apps/desktop/src/components/shob-settings/` → `apps/desktop/src/components/megon-settings/`
- [x] `apps/megon/bin/shob.cjs` → `apps/megon/bin/megon.cjs`
- [x] `apps/desktop/src/utils/shob-session.ts` → `apps/desktop/src/utils/megon-session.ts`
- [x] `apps/desktop/test/shob-session.test.ts` → `apps/desktop/test/megon-session.test.ts`
- [x] Theme files `shob.json` → `megon.json` (3 locations: desktop, server TUI, UI)

## Phase 4: Import Paths (150+ files)
- [x] All `@shob-ai/*` → `@megon/*` across codebase
- [x] `packages/server/tsconfig.json` paths updated

## Phase 5: Environment Variables (50+ variables)
- [x] `packages/server/src/flag/flag.ts` — All `SHOB_*` → `MEGON_*`
- [x] `apps/desktop/electron/main.ts` — `SHOB_SESSION_ID`, `SHOB_TERMINAL_SESSION`, etc.
- [x] `apps/desktop/electron/server.ts` — `SHOB_DISABLE_EMBEDDED_WEB_UI`
- [x] `apps/desktop/electron/sidecar.ts` — `SHOB_SERVER_USERNAME`, `SHOB_SERVER_PASSWORD`
- [x] `scripts/build-sidecar.mjs` — `SHOB_MIGRATIONS` → `MEGON_MIGRATIONS`
- [x] `packages/server/src/installation/meta.ts` — `SHOB_VERSION` → `MEGON_VERSION`, `SHOB_CHANNEL` → `MEGON_CHANNEL`
- [x] `packages/server/src/storage/db.ts` — `SHOB_MIGRATIONS` → `MEGON_MIGRATIONS`
- [x] All other files with `SHOB_*` references

## Phase 6: Config Paths & Database
- [x] `packages/server/src/config/paths.ts` — `PROJECT_DIRS = [".megon"]`, `CONFIG_NAMES = ["megon"]`
- [x] `packages/server/src/config/config.ts` — managed dirs (`/etc/megon`, `C:\ProgramData\megon`, `/Library/Application Support/megon`), `MANAGED_PLIST_DOMAIN` → `ai.megon.managed`, `globalConfigFile()` → `megon.json`, schema URL → `megon.org`, docs URLs → `megon.org`, well-known → `/.well-known/megon`, service tag → `@megon/Config`
- [x] `packages/server/src/storage/db.ts` — `DB_BASENAME` → `"megon"`
- [x] `packages/server/src/global/index.ts` — XDG app name → `"megon"`

## Phase 7: Electron IPC & App Identity
- [x] `apps/desktop/electron/main.ts` — All IPC channels `shob:*` → `megon:*`, `app.setName("Megon")`, `RELEASES_URL` → `MegonLabs/megon`, skill store constants → `MEGON_SKILL_STORE_*`, all console.log prefix → `[megon]`
- [x] `apps/desktop/electron/preload.ts` — All IPC channels, `contextBridge.exposeInMainWorld("megon", ...)`
- [x] `apps/desktop/electron/icon.ts` — `WINDOWS_APP_ID` → `app.megon.desktop`, dev icons `olova-dev` → `megon-dev`
- [x] `apps/desktop/electron/server.ts` — `SIDECAR_SERVICE_NAME` → `megon-server`, `SIDECAR_CRASH_FILE` → `megon-sidecar-crash.log`, regex → `Megon server listening on`, added `shell: true` for Windows spawn fix
- [x] `apps/desktop/electron/sidecar.ts` — `MEGON_SERVER_USERNAME: "megon"`
- [x] `apps/desktop/electron/browser-control.ts` — All `shob` → `megon` in partition, CSS classes, data attributes, console logs
- [x] All renderer files — `window.shob` → `window.megon`

## Phase 8: URLs, GitHub & Package Manager References
- [x] `packages/server/src/installation/index.ts` — install URL → `megon.org/install`, brew → `MegonLabs/tap/megon`, npm → `megon`, GitHub API → `MegonLabs/megon`, user agent → `megon/`, service tag → `@megon/Installation`
- [x] `packages/server/src/provider/provider.ts` — `HTTP-Referer` → `megon.org`, `X-Title` → `megon`, `User-Agent` → `megon`

## Phase 9: CLI Binary, Logo & Scripts
- [x] `apps/megon/bin/megon.cjs` — binary name → `megon`, env → `MEGON_BIN_PATH`
- [x] `packages/server/src/cli/logo.ts` — ASCII art → `MEGON`
- [x] `packages/server/src/index.ts` — script name → `megon`
- [x] `apps/megon/script/build.ts` — binary → `megon`, defines → `MEGON_*`

## Phase 10: i18n & User-Facing Strings
- [x] `apps/desktop/src/i18n/en.ts` — All "Shob" → "Megon" in 20+ string values
- [x] `apps/desktop/src/config/check.ts` — CLI catalog `id: 'megon'`, `label: 'Megon'`
- [x] `apps/desktop/src/components/settings-about.tsx` — appName → "Megon", copyright → "Megon Authors"
- [x] `apps/desktop/src/components/settings-plugins.tsx` — "Shob" → "Megon" in toast messages
- [x] All settings dialogs — provider names, descriptions

## Phase 11: OpenAPI Spec & Tests
- [x] `packages/sdk/openapi.json` — title → "Megon", description → "Megon API"
- [x] All test files — env vars, assertions, mock values updated

## Phase 12: Documentation
- [x] `README.md` — Complete rewrite with dev-friendly language, structure docs, contributing guide
- [x] `SECURITY.md` — "shob" → "Megon", advisory URL → `MegonLabs/megon`
- [x] `apps/megon/README.md` — Updated

## Phase 13: CSS & HTML
- [x] `apps/desktop/src/index.html` — title → "Megon", icon → `megon.png`, added CSP meta tag
- [x] `apps/desktop/src/index.css` — All CSS classes `shob-*` → `megon-*`, CSS vars `--shob-*` → `--megon-*`

## Phase 14: Legacy Brand Cleanup (olova)
- [x] `apps/desktop/electron/dev-icons/olova-dev.ico` → `megon-dev.ico`
- [x] `apps/desktop/electron/dev-icons/olova-dev.png` → `megon-dev.png`
- [x] `scripts/sync-app-icons.mjs` — references → `megon-dev.*`
- [x] `apps/desktop/electron/icon.ts` — dev icon candidates → `megon-dev`

## Phase 15: Final Audit & Bug Fixes
- [x] Zero `shob`/`Shob`/`SHOB` references remaining (verified)
- [x] Zero `olova-dev` references remaining (verified)
- [x] Fixed `spawn EINVAL` — added `shell: process.platform === "win32"` to server.ts spawn
- [x] Fixed CSP warning — added `Content-Security-Policy` meta tag to index.html
- [x] Fixed `LEGACY_DB_BASENAME` — corrected to proper value
- [x] Fixed `PROJECT_DIRS` / `CONFIG_NAMES` — removed accidental legacy shob fallbacks

---

## Brand Mapping

| Old | New |
|-----|-----|
| `shob` | `megon` |
| `Shob` | `Megon` |
| `SHOB` | `MEGON` |
| `shob-ai` | `megon` |
| `@shob-ai/*` | `@megon/*` |
| `shobcoder` | `MegonLabs` |
| `anomalyco` | `MegonLabs` |
| `shob.ai` | `megon.org` |
| `app.shob.desktop` | `app.megon.desktop` |
| `.shob` | `.megon` |
| `shob.json` | `megon.json` |
| `shob.db` | `megon.db` |
| `shob-monorepo` | `megon-monorepo` |
| `shob-desktop` | `megon-desktop` |
| `olova-dev` | `megon-dev` |
| `ai.shob.managed` | `ai.megon.managed` |
| All versions | `0.0.1` |

## Not Changed (External References)
- `.commandcode/` directory (Command Code agent's own config)
- `api.commandcode.ai` URLs (external service)
- `commandcode` provider/plugin names (external API integration)
- `workspace.olova.dev` URL (external API endpoint)

## Phase 16: Theme & Bug Fixes
- [x] `packages/ui/src/theme/themes/oc-2.json` — Changed default primary color to blue (`#3b7dd8` light / `#7ab3f0` dark`)
- [x] `packages/server/src/installation/index.ts` — Fixed scoop upgrade command: split single-string `["scoop update megon@${target}"]` into proper args `["scoop", "update", "megon@${target}"]`
- [x] `apps/desktop/src/context/models.tsx` — Replaced `luxon` dependency with `date-fns` (already in package.json)
- [x] `apps/desktop/package.json` — Added missing dependencies: `zod`, `remeda`, `@solid-primitives/event-bus`
- [x] `scripts/check-desktop-deps.mjs` — Added audit script to verify all desktop imports are covered by declared dependencies

## Files Modified: 250+
## Symbols Renamed: 50+ env vars, 11 IPC channels, 5 service tags, 10+ config keys

## Phase 17: Dev Server Fixes & UI Polish
- [x] **Fixed bun workspace hoisting** — `scripts/dev-electron.mjs` now resolves `vite`, `tsc`, `electron` binaries from `apps/desktop/node_modules` as fallback; added `NODE_PATH` env to all spawned processes
- [x] **Fixed `scripts/ensure-electron.mjs`** — `createRequire` now resolves from `apps/desktop/package.json` so `@electron/get` is found
- [x] **Added missing direct dependencies** to `apps/desktop/package.json`: `shiki`, `@pierre/diffs`, `marked-shiki`, `@solid-primitives/event-listener`, `@solid-primitives/resize-observer` (bun doesn't hoist workspace deps to root)
- [x] **Fixed `apps/desktop/vite.config.ts`** — removed unused `path` import and `__dirname` (caused `noUnusedLocals` TS error in `tsconfig.node.json`); removed broken `@shikijs/core` and `@shikijs/types` aliases pointing to nonexistent `../../node_modules/shiki/...`; added `preserveSymlinks: false`
- [x] **Fixed "megon" → "Megon" casing** in 11 user-facing strings across 5 files:
  - `dialog-openai-compatible.tsx` — provider name, error message, API key description
  - `i18n/en.ts` — Anthropic compat description, color scheme description
  - `App.tsx` — 3 update toast descriptions
  - `Ico.tsx` — image alt text
  - `settings-plugins.tsx` — skill removed toast, plugins subtitle
- [x] **Fixed CSP `connect-src`** — added `http://127.0.0.1:*` and `ws://127.0.0.1:*` (server runs on `127.0.0.1` not `localhost`, CSP treats them as different origins)
- [x] **Fixed `electron-dist/server.ts`** — regex `Megon server listening on` changed to case-insensitive `/megon server listening on/i` (server outputs lowercase `megon`, regex expected uppercase `Megon`, causing 120s startup timeout)
- [x] **Connected providers grid** — changed from `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4` to `grid-cols-1` so each row takes full width and text doesn't wrap
- [x] **Updated footer credit** — `settings-about.tsx` copyright now reads "Copyright © 2026 Megon. Built by Niloy (niloy.co). All rights reserved."

## Phase 18: Undo/Regenerate Icons & GitHub Star Card

### Undo Changes & Regenerate Feature
- [x] **Added `undoChanges` and `regenerate` actions** to `UserActions` type in `packages/ui/src/components/message-part.tsx`
- [x] **Added undo/regenerate icon buttons** inside `UserMessageDisplay`'s copy wrapper (before copy button), using `undo` and `refresh` icons from the UI icon system
- [x] **Removed legacy revert icon** (`reset` icon) and related `busy` state/revert function from `UserMessageDisplay`
- [x] **Created `handleRevert` function** in `apps/desktop/src/components/AgentView.tsx` — shows confirmation dialog, reverts files, cleans up messages, and restores prompt to input
- [x] **Added cleanup endpoint** `POST /:sessionID/cleanup` in `packages/server/src/server/routes/session.ts` — calls `SessionRevert.cleanup()` to remove reverted messages from database
- [x] **Confirmation popup** matches attached image design — title, description, file list with `FileIcon` icons and `+N`/`-N` counts, Cancel/Confirm buttons, theme-aware styling
- [x] **Linear History model** — reverting a prompt removes it, its response, and all subsequent messages; prompt text restored to input for editing
- [x] **Per-message diffs** — popup shows only changes from the specific response (via `message.summary.diffs`), not all session changes
- [x] **Removed `revertMessage` function** and `revert` action from `AgentView.tsx` (no longer needed)

### Dialog CSS Fix
- [x] **Fixed dialog body overflow** — changed `overflow: hidden` to `overflow: visible` on `[data-slot="dialog-body"]` in `packages/ui/src/components/dialog.css` to prevent buttons from being clipped

### GitHub Star Support Card
- [x] **Added persistent GitHub Star card** at bottom of left sidebar in `apps/desktop/src/components/Sidebar.tsx`
- [x] **Added `star` icon** to desktop icon set in `apps/desktop/src/components/ui/icon.tsx`
- [x] Card uses `Badge` component for "Free & Open Source" label, `Icon` component for star, and `nativeApi.invoke("open_external")` to open GitHub URL in external browser
- [x] Card is always visible, non-dismissable, uses theme-aware styling

### Files Modified
- `packages/ui/src/components/message-part.tsx` — UserActions type, UserMessageDisplay buttons
- `packages/ui/src/components/dialog.css` — overflow fix
- `apps/desktop/src/components/AgentView.tsx` — handleRevert, cleanup call, removed revertMessage
- `apps/desktop/src/components/Sidebar.tsx` — GitHub Star card
- `apps/desktop/src/components/ui/icon.tsx` — star icon
- `packages/server/src/server/routes/session.ts` — cleanup endpoint
