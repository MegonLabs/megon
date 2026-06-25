import { describe, expect, test } from "bun:test"
import {
  findReusableEmptyRootMegonSession,
  normalizeMegonSessionTitle,
  sessionHasUserPrompt,
  toLocalMegonSession,
  type MegonSessionLike,
} from "../src/utils/megon-session.ts"

const session = (overrides: Partial<MegonSessionLike> = {}): MegonSessionLike => ({
  id: "ses_empty",
  time: {
    created: 100,
    updated: 100,
  },
  ...overrides,
})

describe("megon session helpers", () => {
  test("normalizes missing and placeholder titles to New session", () => {
    expect(normalizeMegonSessionTitle()).toBe("New session")
    expect(normalizeMegonSessionTitle("")).toBe("New session")
    expect(normalizeMegonSessionTitle("Terminal")).toBe("New session")
    expect(normalizeMegonSessionTitle("New session - 2026-06-06T01:23:57.000Z")).toBe("New session")
  })

  test("keeps generated titles for sidebar display", () => {
    expect(normalizeMegonSessionTitle("Fix sidebar session cleanup")).toBe("Fix sidebar session cleanup")
    expect(toLocalMegonSession(session({ title: "Implement reusable empty sessions" })).name).toBe(
      "Implement reusable empty sessions",
    )
  })

  test("detects whether a session has a user prompt", () => {
    expect(sessionHasUserPrompt(undefined)).toBe(false)
    expect(sessionHasUserPrompt([])).toBe(false)
    expect(sessionHasUserPrompt([{ role: "assistant" }])).toBe(false)
    expect(sessionHasUserPrompt([{ role: "assistant" }, { role: "user" }])).toBe(true)
  })

  test("reuses a known-empty root session", () => {
    const empty = session({ id: "ses_empty", time: { created: 100, updated: 120 } })
    const prompted = session({ id: "ses_prompted", time: { created: 200, updated: 220 } })

    expect(
      findReusableEmptyRootMegonSession(
        [empty, prompted],
        {
          ses_empty: [],
          ses_prompted: [{ role: "user" }],
        },
        null,
      )?.id,
    ).toBe("ses_empty")
  })

  test("does not reuse prompted, child, archived, or unknown-message sessions", () => {
    const sessions = [
      session({ id: "ses_prompted" }),
      session({ id: "ses_child", parentID: "ses_parent" }),
      session({ id: "ses_archived", time: { created: 100, updated: 100, archived: 110 } }),
      session({ id: "ses_unknown" }),
    ]

    expect(
      findReusableEmptyRootMegonSession(sessions, {
        ses_prompted: [{ role: "user" }],
        ses_child: [],
        ses_archived: [],
      }),
    ).toBeUndefined()
  })

  test("prefers the active empty session when several are reusable", () => {
    const older = session({ id: "ses_older", time: { created: 100, updated: 100 } })
    const newer = session({ id: "ses_newer", time: { created: 200, updated: 200 } })

    expect(
      findReusableEmptyRootMegonSession(
        [older, newer],
        {
          ses_older: [],
          ses_newer: [],
        },
        "ses_older",
      )?.id,
    ).toBe("ses_older")
  })
})
