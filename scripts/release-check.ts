#!/usr/bin/env bun

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"

interface Check {
  name: string
  status: "PASS" | "FAIL"
  message?: string
}

const root = import.meta.dir + "/.."
const megonDir = join(root, "apps", "megon")
const checks: Check[] = []

function check(name: string, condition: boolean, message?: string) {
  checks.push({
    name,
    status: condition ? "PASS" : "FAIL",
    message,
  })
}

function fileExists(path: string): boolean {
  return existsSync(join(root, path))
}

function fileExistsInMegon(path: string): boolean {
  return existsSync(join(megonDir, path))
}

// --- Phase 1: Repository Metadata ---
check("LICENSE exists", fileExists("LICENSE"))
check("README exists", fileExists("README.md"))
check("SECURITY exists", fileExists("SECURITY.md"))
check("CONTRIBUTING exists", fileExists("CONTRIBUTING.md"))
check("Issue templates exist", fileExists(".github/ISSUE_TEMPLATE/bug_report.yml"))
check("CI workflow exists", fileExists(".github/workflows/build.yml"))
check("Release workflow exists", fileExists(".github/workflows/release.yml"))

// --- Phase 2: Package Metadata ---
const pkgPath = join(megonDir, "package.json")
const pkg = existsSync(pkgPath) ? JSON.parse(readFileSync(pkgPath, "utf8")) : null

check("package.json exists", !!pkg)

if (pkg) {
  const version = pkg.version
  check("version is valid semver", /^\d+\.\d+\.\d+(-\w+)?$/.test(version), `version: ${version}`)
  check("repository field exists", !!pkg.repository)
  check("homepage field exists", !!pkg.homepage)
  check("bugs field exists", !!pkg.bugs)
  check("author field exists", !!pkg.author)
  check("license field exists", !!pkg.license)
  check("bin entry exists", !!pkg.bin?.megon)
  check("files field exists", !!pkg.files?.length)
  check("description exists", !!pkg.description)
  check("keywords exist", !!pkg.keywords?.length)
}

// --- Phase 3: Binary & Launcher ---
check(
  "bin/megon.cjs exists",
  fileExistsInMegon("bin/megon.cjs"),
)

const megonDist = join(megonDir, "dist", "bin")
const ext = process.platform === "win32" ? ".exe" : ""
const binaryName = `megon${ext}`
const binaryPath = join(megonDist, binaryName)
const binaryExists = existsSync(binaryPath)

check(`dist/bin/${binaryName} exists`, binaryExists)

if (binaryExists) {
  const size = statSync(binaryPath).size
  const sizeMB = Math.round(size / 1024 / 1024)
  check("binary size > 1MB", sizeMB > 1, `size: ${sizeMB} MB`)
  check("binary size < 500MB", sizeMB < 500, `size: ${sizeMB} MB`)
}

// --- Phase 4: License in Package ---
check(
  "LICENSE in npm files",
  pkg?.files?.includes("LICENSE") ?? false,
  "LICENSE not included in files array",
)

// --- Phase 5: Security Checks ---
const secretPatterns = [
  /GOCSPX/,
  /1071006060591/,
  /ghp_[a-zA-Z0-9]{36}/,
  /sk-[a-zA-Z0-9]{20,}/,
  /AKIA[A-Z0-9]{16}/,
  /AIza[A-Za-z0-9_-]{35}/,
  /Bearer [a-zA-Z0-9._-]{20,}/,
]

const personalPatterns = [
  /\/Users\/davidhill/,
  /\/Users\/thdxr/,
  /\/home\/thdxr/,
]

let secretsFound = false
let personalPathsFound = false

function scanDir(dir: string, patterns: RegExp[]): boolean {
  let found = false
  try {
    const entries = readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (
        entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist" ||
        entry.name === ".megon" || entry.name === ".cache" || entry.name === "scripts" ||
        entry.name === "docs" || entry.name === "skills" || entry.name === ".github"
      ) continue
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (scanDir(fullPath, patterns)) found = true
      } else if (/\.(ts|tsx|js|mjs|json|md)$/.test(entry.name)) {
        const content = readFileSync(fullPath, "utf8")
        for (const pattern of patterns) {
          if (pattern.test(content)) {
            found = true
          }
        }
      }
    }
  } catch {}
  return found
}

secretsFound = scanDir(root, secretPatterns)
personalPathsFound = scanDir(root, personalPatterns)

check("no hardcoded secrets", !secretsFound, secretsFound ? "secrets found in source" : undefined)
check("no personal paths", !personalPathsFound, personalPathsFound ? "personal paths found" : undefined)

// --- Report ---
console.log("\n# Release Readiness Report\n")

const pass = checks.filter((c) => c.status === "PASS").length
const fail = checks.filter((c) => c.status === "FAIL").length
const total = checks.length

for (const c of checks) {
  const icon = c.status === "PASS" ? "✓" : "✗"
  const color = c.status === "PASS" ? "\x1b[32m" : "\x1b[31m"
  const reset = "\x1b[0m"
  const detail = c.message ? ` (${c.message})` : ""
  console.log(`${color}${icon}${reset} ${c.name.padEnd(30)} ${c.status}${detail}`)
}

console.log("")
console.log(`Score: ${pass}/${total}`)
console.log("")

if (fail > 0) {
  console.log(`\x1b[31mFAIL\x1b[0m — ${fail} check(s) failed`)
  process.exit(1)
} else {
  console.log(`\x1b[32mPASS\x1b[0m — All checks passed`)
  process.exit(0)
}
