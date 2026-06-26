import { describe, expect, test, mock, beforeEach, afterEach } from "bun:test"
import fs from "fs"
import { Database } from "bun:sqlite"

mock.module("electron", () => {
  return {
    app: {
      getPath: mock(() => "/tmp/megon-test")
    }
  }
})

mock.module("node:sqlite", () => {
  return {
    DatabaseSync: Database
  }
})

const { saveWorkTerminal, loadWorkTerminals, closeSessionDatabase, deleteWorkTerminal, saveProject, initSessionDatabase } = await import("../electron/session-db")

describe("session-db", () => {
  beforeEach(() => {
    fs.mkdirSync("/tmp/megon-test", { recursive: true })
    fs.mkdirSync("/tmp/megon-test/sessions", { recursive: true })
    initSessionDatabase()
  })

  afterEach(() => {
    closeSessionDatabase()
    try {
        fs.unlinkSync("/tmp/megon-test/megon.db")
        fs.unlinkSync("/tmp/megon-test/megon.db-shm")
        fs.unlinkSync("/tmp/megon-test/megon.db-wal")
    } catch(e) {}
  })

  describe("saveWorkTerminal", () => {
    test("inserts a new terminal and loads it", () => {
        saveProject({
            id: "proj1",
            name: "Proj 1",
            path: "/tmp",
            sessions: []
        })

        const terminal = {
            id: "term1",
            projectId: "proj1",
            title: "My Terminal",
            shell: "bash",
            sortOrder: 1,
            timeCreated: 1000,
        }

        saveWorkTerminal(terminal)

        const terminals = loadWorkTerminals("proj1")
        expect(terminals.length).toBe(1)
        expect(terminals[0].id).toBe("term1")
        expect(terminals[0].title).toBe("My Terminal")
        expect(terminals[0].shell).toBe("bash")
        expect(terminals[0].sortOrder).toBe(1)
        expect(terminals[0].timeCreated).toBe(1000)
        expect(terminals[0].timeUpdated).toBeGreaterThan(0)
    })

    test("updates an existing terminal", () => {
        saveProject({
            id: "proj2",
            name: "Proj 2",
            path: "/tmp",
            sessions: []
        })

        saveWorkTerminal({
            id: "term2",
            projectId: "proj2",
            title: "Original",
            shell: "bash",
        })

        saveWorkTerminal({
            id: "term2",
            projectId: "proj2",
            title: "Updated",
            shell: "zsh",
            sortOrder: 5
        })

        const terminals = loadWorkTerminals("proj2")
        expect(terminals.length).toBe(1)
        expect(terminals[0].title).toBe("Updated")
        expect(terminals[0].shell).toBe("zsh")
        expect(terminals[0].sortOrder).toBe(5)
    })
  })
})
