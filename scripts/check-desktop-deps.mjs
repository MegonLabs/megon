import { readdirSync, readFileSync, existsSync } from "node:fs"
import { join, resolve } from "node:path"

const srcDir = resolve("apps/desktop/src")
const pkgPath = resolve("apps/desktop/package.json")

function scan(dir) {
  const res = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      res.push(...scan(full))
    } else if (/\.tsx?$/.test(entry.name)) {
      const content = readFileSync(full, "utf8")
      for (const m of content.matchAll(/from\s+['"]([^.'@/][^'"]*)['"]/g)) {
        res.push({ pkg: m[1], file: full.replace(resolve(".") + "/", "") })
      }
    }
  }
  return res
}

const imports = scan(srcDir)

const pkgMap = new Map()
for (const { pkg, file } of imports) {
  const root = pkg.startsWith("@") ? pkg.split("/").slice(0, 2).join("/") : pkg.split("/")[0]
  if (!pkgMap.has(root)) pkgMap.set(root, [])
  pkgMap.get(root).push(file)
}

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
const allDeps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.optionalDependencies }

const missing = []
const present = []
for (const [name, files] of [...pkgMap.entries()].sort()) {
  if (name in allDeps) {
    present.push(name)
  } else {
    missing.push({ name, files: [...new Set(files)] })
  }
}

if (missing.length === 0) {
  console.log("All external imports are covered by dependencies.")
} else {
  console.log("MISSING dependencies in apps/desktop/package.json:\n")
  for (const { name, files } of missing) {
    console.log(`  ${name}  (imported in ${files.length} file(s)):`)
    for (const f of files) console.log(`    - ${f}`)
    console.log()
  }
}
