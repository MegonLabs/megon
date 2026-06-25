import { describe, expect, test } from "bun:test"
import { Binary } from "../src/binary"

describe("Binary search", () => {
  test("finds existing item", () => {
    const items = [{ id: "a" }, { id: "b" }, { id: "c" }]
    const result = Binary.search(items, "b", (i) => i.id)
    expect(result).toEqual({ found: true, index: 1 })
  })

  test("returns correct index for missing item", () => {
    const items = [{ id: "a" }, { id: "c" }]
    const result = Binary.search(items, "b", (i) => i.id)
    expect(result).toEqual({ found: false, index: 1 })
  })

  test("insert keeps sorted order", () => {
    const items = [{ id: "a" }, { id: "c" }]
    Binary.insert(items, { id: "b" }, (i) => i.id)
    expect(items.map((i) => i.id)).toEqual(["a", "b", "c"])
  })
})
