import { describe, expect, test } from "bun:test"
import { base64Encode, base64Decode, checksum, sampledChecksum } from "../src/encode"

describe("encode utils", () => {
  test("base64 roundtrip", () => {
    const original = "hello world 🚀"
    const encoded = base64Encode(original)
    const decoded = base64Decode(encoded)
    expect(decoded).toBe(original)
  })

  test("checksum returns consistent values", () => {
    expect(checksum("hello")).toBe(checksum("hello"))
    expect(checksum("hello")).not.toBe(checksum("world"))
  })

  test("checksum returns undefined for empty string", () => {
    expect(checksum("")).toBeUndefined()
  })

  test("sampledChecksum handles large content", () => {
    const small = "a".repeat(100)
    expect(sampledChecksum(small)).toBe(checksum(small))

    const large = "b".repeat(1_000_000)
    const result = sampledChecksum(large)
    expect(result).toContain(":")
  })
})
