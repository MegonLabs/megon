import { describe, expect, test, mock, beforeAll, afterAll, beforeEach, afterEach } from "bun:test";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

// The upstream already had a nice `node:sqlite` mock using `Database` from `bun:sqlite`
// and importing the real file via dynamic import.
import { Database } from "bun:sqlite";

mock.module("electron", () => {
  return {
    app: {
      getPath: mock(() => "/tmp/megon-test")
    }
  }
});

mock.module("node:sqlite", () => {
  return {
    DatabaseSync: Database
  }
});

const {
  saveWorkTerminal,
  loadWorkTerminals,
  closeSessionDatabase,
  deleteWorkTerminal,
  saveProject,
  initSessionDatabase,
  reorderProjects,
  loadProjects,
  deleteProject
} = await import("../electron/session-db");

describe("session-db", () => {
  beforeEach(() => {
    fs.mkdirSync("/tmp/megon-test", { recursive: true });
    fs.mkdirSync("/tmp/megon-test/sessions", { recursive: true });
    initSessionDatabase();
  });

  afterEach(() => {
    closeSessionDatabase();
    try {
        fs.unlinkSync("/tmp/megon-test/megon.db");
        fs.unlinkSync("/tmp/megon-test/megon.db-shm");
        fs.unlinkSync("/tmp/megon-test/megon.db-wal");
    } catch (e) { /* ignore */ }
  });

  describe("saveWorkTerminal", () => {
    test("inserts a new terminal and loads it", () => {
        saveProject({
            id: "proj1",
            name: "Proj 1",
            path: "/tmp",
            sessions: []
        });

        const terminal = {
            id: "term1",
            projectId: "proj1",
            title: "My Terminal",
            shell: "bash",
            sortOrder: 1,
            timeCreated: 1000,
        };

        saveWorkTerminal(terminal);

        const terminals = loadWorkTerminals("proj1");
        expect(terminals.length).toBe(1);
        expect(terminals[0].id).toBe("term1");
        expect(terminals[0].title).toBe("My Terminal");
        expect(terminals[0].shell).toBe("bash");
        expect(terminals[0].sortOrder).toBe(1);
        expect(terminals[0].timeCreated).toBe(1000);
        expect(terminals[0].timeUpdated).toBeGreaterThan(0);
    });

    test("updates an existing terminal", () => {
        saveProject({
            id: "proj2",
            name: "Proj 2",
            path: "/tmp",
            sessions: []
        });

        saveWorkTerminal({
            id: "term2",
            projectId: "proj2",
            title: "Original",
            shell: "bash",
        });

        saveWorkTerminal({
            id: "term2",
            projectId: "proj2",
            title: "Updated",
            shell: "zsh",
            sortOrder: 5
        });

        const terminals = loadWorkTerminals("proj2");
        expect(terminals.length).toBe(1);
        expect(terminals[0].title).toBe("Updated");
        expect(terminals[0].shell).toBe("zsh");
        expect(terminals[0].sortOrder).toBe(5);
    });
  });

  describe("reorderProjects", () => {
    beforeEach(() => {
      // Clear all existing projects for these specific tests
      for (const p of loadProjects()) {
        deleteProject(p.id);
      }
    });

    test("updates the sort_order of projects correctly", () => {
      saveProject({ id: "p1", name: "P1", path: "/p1", sessions: [] });
      saveProject({ id: "p2", name: "P2", path: "/p2", sessions: [] });
      saveProject({ id: "p3", name: "P3", path: "/p3", sessions: [] });
      saveProject({ id: "p4", name: "P4", path: "/p4", sessions: [] });

      const initial = loadProjects();
      expect(initial.map((p: any) => p.id)).toEqual(["p1", "p2", "p3", "p4"]);

      const reordered = reorderProjects(["p3", "p1"]);
      expect(reordered.map((p: any) => p.id)).toEqual(["p3", "p1", "p2", "p4"]);

      const persisted = loadProjects();
      expect(persisted.map((p: any) => p.id)).toEqual(["p3", "p1", "p2", "p4"]);
    });

    test("handles empty inputs safely", () => {
      saveProject({ id: "p1", name: "P1", path: "/p1", sessions: [] });
      saveProject({ id: "p2", name: "P2", path: "/p2", sessions: [] });

      expect(reorderProjects([]).map((p: any) => p.id)).toEqual(["p1", "p2"]);
      expect(reorderProjects().map((p: any) => p.id)).toEqual(["p1", "p2"]);
    });

    test("handles unknown ids safely", () => {
      saveProject({ id: "p1", name: "P1", path: "/p1", sessions: [] });
      saveProject({ id: "p2", name: "P2", path: "/p2", sessions: [] });

      expect(reorderProjects(["p2", "unknown"]).map((p: any) => p.id)).toEqual(["p2", "p1"]);
    });

    test("handles duplicate ids safely", () => {
      saveProject({ id: "p1", name: "P1", path: "/p1", sessions: [] });
      saveProject({ id: "p2", name: "P2", path: "/p2", sessions: [] });

      expect(reorderProjects(["p2", "p2", "p1"]).map((p: any) => p.id)).toEqual(["p2", "p1"]);
    });
  });
});
