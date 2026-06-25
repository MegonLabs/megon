import { describe, expect, test } from "bun:test"
import { tool } from "../src/tool"

describe("tool", () => {
  test("creates tool definition with schema", () => {
    const myTool = tool({
      description: "A test tool",
      args: {
        name: tool.schema.string().describe("A name"),
      },
      async execute(args) {
        return `Hello ${args.name}!`
      },
    })

    expect(myTool.description).toBe("A test tool")
    expect(myTool.args.name).toBeDefined()
  })

  test("schema is zod", () => {
    expect(tool.schema.string).toBeDefined()
    expect(tool.schema.number).toBeDefined()
  })
})
