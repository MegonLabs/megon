import { describe, expect, test } from "bun:test"
import { retry } from "../src/retry"

describe("retry", () => {
  test("succeeds on first attempt", async () => {
    const result = await retry(async () => "ok", { attempts: 3, delay: 1 })
    expect(result).toBe("ok")
  })

  test("retries on transient error", async () => {
    let attempts = 0
    const result = await retry(
      async () => {
        attempts++
        if (attempts < 3) throw new Error("ECONNRESET")
        return "done"
      },
      { attempts: 3, delay: 1, factor: 1 },
    )
    expect(result).toBe("done")
    expect(attempts).toBe(3)
  })

  test("throws after exhausting attempts", async () => {
    await expect(
      retry(async () => {
        throw new Error("ECONNRESET")
      }, { attempts: 2, delay: 1, factor: 1 }),
    ).rejects.toThrow("ECONNRESET")
  })
})
