import { describe, expect, test } from "bun:test"
import { NamedError } from "../src/error"

describe("NamedError", () => {
  const TestError = NamedError.create(
    "TestError",
    { message: "test message", code: "number" },
  )

  test("creates error with correct name", () => {
    const err = new TestError({ message: "fail", code: 42 })
    expect(err.name).toBe("TestError")
    expect(err).toBeInstanceOf(Error)
  })

  test("serializes to object", () => {
    const err = new TestError({ message: "fail", code: 42 })
    const obj = err.toObject()
    expect(obj).toEqual({ name: "TestError", data: { message: "fail", code: 42 } })
  })

  test("isInstance works", () => {
    const err = new TestError({ message: "fail", code: 1 })
    expect(TestError.isInstance(err)).toBe(true)
    expect(TestError.isInstance(new Error("no"))).toBe(false)
  })

  test("UnknownError works", () => {
    const err = new NamedError.Unknown({ message: "unknown" })
    expect(err.name).toBe("UnknownError")
    expect(err.toObject().name).toBe("UnknownError")
  })
})
