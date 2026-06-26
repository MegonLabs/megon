import { describe, expect, test, mock, beforeAll, afterAll, beforeEach } from "bun:test";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

// We dynamically rewrite session-db.ts to use bun:sqlite instead of node:sqlite
// during testing because Bun's test runner doesn't natively support node:sqlite yet.
const sessionDbCode = fs.readFileSync(path.join(__dirname, "../electron/session-db.ts"), "utf-8");
const rewrittenCode = sessionDbCode.replace('import { DatabaseSync } from "node:sqlite";', 'import { Database as DatabaseSync } from "bun:sqlite";');

const tempDbFile = path.join(__dirname, "session-db-temp.ts");
fs.writeFileSync(tempDbFile, rewrittenCode);

mock.module("electron", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "megon-test-"));
  return {
    app: {
      getPath: (name: string) => {
        if (name === "userData") {
          return tempDir;
        }
        return tempDir;
      },
    },
  };
});

// Import the rewritten test module
const sessionDb = require(tempDbFile);

describe("session db", () => {
  beforeAll(() => {
    sessionDb.initSessionDatabase();
  });

  afterAll(() => {
    sessionDb.closeSessionDatabase();
    // Clean up temporary file
    if (fs.existsSync(tempDbFile)) {
      fs.unlinkSync(tempDbFile);
    }
  });

  beforeEach(() => {
    for (const p of sessionDb.loadProjects()) {
      sessionDb.deleteProject(p.id);
    }
  });

  test("reorderProjects updates the sort_order of projects correctly", () => {
    sessionDb.saveProject({ id: "p1", name: "P1", path: "/p1", sessions: [] });
    sessionDb.saveProject({ id: "p2", name: "P2", path: "/p2", sessions: [] });
    sessionDb.saveProject({ id: "p3", name: "P3", path: "/p3", sessions: [] });
    sessionDb.saveProject({ id: "p4", name: "P4", path: "/p4", sessions: [] });

    const initial = sessionDb.loadProjects();
    expect(initial.map((p: any) => p.id)).toEqual(["p1", "p2", "p3", "p4"]);

    const reordered = sessionDb.reorderProjects(["p3", "p1"]);
    expect(reordered.map((p: any) => p.id)).toEqual(["p3", "p1", "p2", "p4"]);

    const persisted = sessionDb.loadProjects();
    expect(persisted.map((p: any) => p.id)).toEqual(["p3", "p1", "p2", "p4"]);
  });

  test("reorderProjects handles empty inputs safely", () => {
    sessionDb.saveProject({ id: "p1", name: "P1", path: "/p1", sessions: [] });
    sessionDb.saveProject({ id: "p2", name: "P2", path: "/p2", sessions: [] });

    expect(sessionDb.reorderProjects([]).map((p: any) => p.id)).toEqual(["p1", "p2"]);
    expect(sessionDb.reorderProjects().map((p: any) => p.id)).toEqual(["p1", "p2"]);
  });

  test("reorderProjects handles unknown ids safely", () => {
    sessionDb.saveProject({ id: "p1", name: "P1", path: "/p1", sessions: [] });
    sessionDb.saveProject({ id: "p2", name: "P2", path: "/p2", sessions: [] });

    expect(sessionDb.reorderProjects(["p2", "unknown"]).map((p: any) => p.id)).toEqual(["p2", "p1"]);
  });

  test("reorderProjects handles duplicate ids safely", () => {
    sessionDb.saveProject({ id: "p1", name: "P1", path: "/p1", sessions: [] });
    sessionDb.saveProject({ id: "p2", name: "P2", path: "/p2", sessions: [] });

    expect(sessionDb.reorderProjects(["p2", "p2", "p1"]).map((p: any) => p.id)).toEqual(["p2", "p1"]);
  });
});
