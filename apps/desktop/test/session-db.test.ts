import "./session-db-test-wrapper.ts";
import { test, expect, afterEach, afterAll } from "bun:test";
import { rmSync } from "node:fs";

import {
  loadProjects,
  saveProject,
  deleteProject,
} from "../electron/session-db.ts";

import { tempDir } from "./session-db-test-wrapper.ts";

afterAll(() => {
  try {
    rmSync(tempDir, { recursive: true, force: true });
  } catch {}
});


afterEach(() => {
  const projects = loadProjects();
  for (const p of projects) {
    deleteProject(p.id);
  }
});

test("loadProjects returns empty array when there are no projects", () => {
  const projects = loadProjects();
  expect(projects).toEqual([]);
});

test("loadProjects retrieves correctly saved project", () => {
  const projectToSave = {
    id: "proj_1",
    name: "My Proj",
    path: "/home/user/proj",
    color: "#ff0000",
    logoPath: "/path/to/logo.png",
    pinned: true,
    sessions: []
  };

  saveProject(projectToSave);

  const projects = loadProjects();
  expect(projects.length).toBe(1);
  expect(projects[0]).toEqual(projectToSave);
});

test("loadProjects sorts projects by sort_order and time_updated", () => {
  const p1 = { id: "proj_1", name: "Project 1", path: "/1", sessions: [] };
  const p2 = { id: "proj_2", name: "Project 2", path: "/2", sessions: [] };
  const p3 = { id: "proj_3", name: "Project 3", path: "/3", sessions: [] };

  saveProject(p3);
  saveProject(p2);
  saveProject(p1);

  const loaded = loadProjects();
  expect(loaded.map(p => p.id)).toEqual(["proj_3", "proj_2", "proj_1"]);
});

test("loadProjects retrieves projects with their sessions", () => {
  const project = {
    id: "proj_session_test",
    name: "Project With Sessions",
    path: "/test",
    pinned: false,
    sessions: [
      {
        id: "sess_1",
        name: "Terminal 1",
        shell: "/bin/bash",
        cliTool: null,
        pendingLaunchCommand: null,
        pinned: true,
        createdAt: 1000,
        lastActiveAt: 2000,
        commandCount: 5,
        startupDurationMs: 150
      },
      {
        id: "sess_2",
        name: "Terminal 2",
        shell: "/bin/zsh",
        cliTool: "git",
        pendingLaunchCommand: "git status",
        pinned: false,
        createdAt: 1500,
        lastActiveAt: 1500,
        commandCount: 0,
        startupDurationMs: null
      }
    ]
  };

  saveProject(project);

  const loaded = loadProjects();
  expect(loaded.length).toBe(1);
  const loadedProject = loaded[0];

  expect(loadedProject.id).toBe(project.id);
  expect(loadedProject.sessions.length).toBe(2);

  expect(loadedProject.sessions[0].id).toBe("sess_1");
  expect(loadedProject.sessions[1].id).toBe("sess_2");

  expect(loadedProject.sessions[0]).toEqual(project.sessions[0]);
  expect(loadedProject.sessions[1]).toEqual(project.sessions[1]);
});
