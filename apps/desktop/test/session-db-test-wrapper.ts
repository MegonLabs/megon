import { mock } from "bun:test";
import { Database } from "bun:sqlite";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

mock.module("node:sqlite", () => {
  class DatabaseSync {
    db: Database;
    constructor(path: string) {
      this.db = new Database(path);
    }
    exec(sql: string) {
      this.db.exec(sql);
    }
    prepare(sql: string) {
      const stmt = this.db.prepare(sql);
      return {
        run: (...params: any[]) => stmt.run(...params),
        get: (...params: any[]) => stmt.get(...params),
        all: (...params: any[]) => stmt.all(...params),
      };
    }
    close() {
      this.db.close();
    }
  }
  return { DatabaseSync };
});

export const tempDir = mkdtempSync(join(tmpdir(), "megon-test-"));

mock.module("electron", () => {
  return {
    app: {
      getPath: (name: string) => {
        if (name === "userData") return tempDir;
        return "/tmp";
      }
    }
  };
});
