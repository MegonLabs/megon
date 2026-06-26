import { describe, expect, test, mock, spyOn, afterEach, beforeEach } from "bun:test"
import path from "node:path"
import fsSync from "node:fs"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let isPackagedMock = true

mock.module("electron", () => {
  return {
    app: {
      get isPackaged() { return isPackagedMock },
      dock: {
        setIcon: () => {}
      },
      setAppUserModelId: () => {}
    },
    nativeImage: {
      createFromPath: () => {}
    }
  }
})

describe("resolveAppIconPath", () => {
  let resolveAppIconPath: any

  beforeEach(async () => {
    isPackagedMock = true
    process.resourcesPath = "/mock/resources"
    const mod = await import("../electron/icon.ts")
    resolveAppIconPath = mod.resolveAppIconPath
  })

  afterEach(() => {
    mock.restore()
  })

  test("returns undefined if no icon exists", () => {
    spyOn(fsSync, "existsSync").mockReturnValue(false)

    const result = resolveAppIconPath("win32")
    expect(result).toBeUndefined()
  })

  test("resolves .ico for win32", () => {
    spyOn(fsSync, "existsSync").mockImplementation((p) => {
      return p.toString().endsWith("icon.ico")
    })

    const result = resolveAppIconPath("win32")
    expect(result?.endsWith(".ico")).toBe(true)
    expect(result?.includes("icon.ico")).toBe(true)
  })

  test("resolves .icns for darwin", () => {
    spyOn(fsSync, "existsSync").mockImplementation((p) => {
      return p.toString().endsWith("icon.icns")
    })

    const result = resolveAppIconPath("darwin")
    expect(result?.endsWith(".icns")).toBe(true)
  })

  test("resolves .png for linux", () => {
    spyOn(fsSync, "existsSync").mockImplementation((p) => {
      return p.toString().endsWith("icon.png")
    })

    const result = resolveAppIconPath("linux")
    expect(result?.endsWith(".png")).toBe(true)
  })

  test("uses fallback extension if preferred is missing", () => {
    spyOn(fsSync, "existsSync").mockImplementation((p) => {
      // simulate missing .ico but existing .png
      return p.toString().endsWith("icon.png")
    })

    const result = resolveAppIconPath("win32")
    expect(result?.endsWith(".png")).toBe(true)
  })

  test("checks unpacked paths when not packaged", () => {
    isPackagedMock = false
    spyOn(fsSync, "existsSync").mockImplementation((p) => {
      return p.toString().includes("megon-dev") && p.toString().endsWith(".png")
    })

    const result = resolveAppIconPath("win32")
    expect(result?.endsWith(".png")).toBe(true)
    expect(result?.includes("megon-dev")).toBe(true)
  })

  test("returns undefined if process platform is used and no icon exists", () => {
    spyOn(fsSync, "existsSync").mockReturnValue(false)

    const result = resolveAppIconPath() // Should use process.platform default
    expect(result).toBeUndefined()
  })
})
