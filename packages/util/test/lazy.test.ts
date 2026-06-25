import { describe, expect, test } from "bun:test"
import { lazy } from "../src/lazy"
import { iife } from "../src/iife"

describe("lazy", () => {
  test("evaluates only once", () => {
    let calls = 0
    const fn = lazy(() => ++calls)
    expect(fn()).toBe(1)
    expect(fn()).toBe(1)
    expect(calls).toBe(1)
  })
})

describe("iife", () => {
  test("executes and returns value", () => {
    expect(iife(() => 42)).toBe(42)
  })
})
