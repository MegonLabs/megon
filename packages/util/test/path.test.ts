import { describe, expect, test } from "bun:test"
import { getFilename, getDirectory, getFileExtension, getFilenameTruncated, truncateMiddle } from "../src/path"

describe("path utils", () => {
  test("getFilename extracts filename from path", () => {
    expect(getFilename("/home/user/file.ts")).toBe("file.ts")
    expect(getFilename("C:\\Users\\test\\doc.txt")).toBe("doc.txt")
    expect(getFilename(undefined)).toBe("")
  })

  test("getDirectory extracts directory", () => {
    expect(getDirectory("/home/user/file.ts")).toBe("/home/user/")
    expect(getDirectory("file.ts")).toBe("/")
  })

  test("getFileExtension extracts extension", () => {
    expect(getFileExtension("file.ts")).toBe("ts")
    expect(getFileExtension("noext")).toBe("noext")
  })

  test("getFilenameTruncated truncates long names", () => {
    expect(getFilenameTruncated("short.ts")).toBe("short.ts")
    expect(getFilenameTruncated("a-very-long-filename-with-many-characters.ts", 15)).toContain("…")
  })

  test("truncateMiddle truncates long text", () => {
    expect(truncateMiddle("short")).toBe("short")
    expect(truncateMiddle("abcdefghij", 6)).toContain("…")
  })
})
