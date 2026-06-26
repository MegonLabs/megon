import { describe, expect, test } from "bun:test";
import path from "node:path";
import { detectShellsInternal, resolveCommand, type ShellDetectionDeps } from "../electron/shell-detector.ts";

describe("resolveCommand", () => {
  test("returns null when envPath is empty and command does not exist", () => {
    // Generate a unique cache key by passing a unique command or platform
    const result = resolveCommand("non_existent_cmd_xyz", "", "linux");
    expect(result).toBeNull();
  });

  test("returns absolute path if command is absolute and exists", () => {
    // We can use the current test file as an existing absolute path
    const absolutePath = path.resolve(__filename);
    const result = resolveCommand(absolutePath, "", "linux");
    expect(result).toBe(absolutePath);
  });

  test("returns null if command is absolute but does not exist", () => {
    const absolutePath = path.resolve(__dirname, "does_not_exist.txt");
    const result = resolveCommand(absolutePath, "", "linux");
    expect(result).toBeNull();
  });
});

describe("shell detector", () => {
  // Normalize mockExists keys for cross-platform matching
  const normalize = (p: string) => p.replace(/\\/g, "/");

  test("resolves Windows shells in correct priority order", () => {
    const mockExists = new Set<string>([
      normalize("C:\\Program Files\\Git\\bin\\bash.exe"),
      normalize("C:\\Program Files\\PowerShell\\7\\pwsh.exe"),
      normalize("C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"),
      normalize("C:\\Windows\\System32\\cmd.exe"),
    ]);

    const deps: ShellDetectionDeps = {
      platform: "win32",
      homedir: "C:\\Users\\test",
      env: {
        SystemRoot: "C:\\Windows",
        ProgramFiles: "C:\\Program Files",
        ComSpec: "C:\\Windows\\System32\\cmd.exe",
      },
      existsSync: (p) => mockExists.has(normalize(p)),
      resolveCommand: (cmd) => {
        if (cmd === "git.exe") return null;
        if (cmd === "bash.exe") return null;
        if (cmd === "pwsh.exe") return "C:\\Program Files\\PowerShell\\7\\pwsh.exe";
        if (cmd === "powershell.exe") return "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
        if (cmd === "cmd.exe") return "C:\\Windows\\System32\\cmd.exe";
        return null;
      },
    };

    const detected = detectShellsInternal(deps).map(normalize);

    expect(detected).toEqual([
      normalize("C:\\Program Files\\Git\\bin\\bash.exe"),
      normalize("C:\\Program Files\\PowerShell\\7\\pwsh.exe"),
      normalize("C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"),
      normalize("C:\\Windows\\System32\\cmd.exe"),
    ]);
  });

  test("resolves Windows shells when Git Bash is missing, fallback to others", () => {
    const mockExists = new Set<string>([
      normalize("C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"),
      normalize("C:\\Windows\\System32\\cmd.exe"),
    ]);

    const deps: ShellDetectionDeps = {
      platform: "win32",
      homedir: "C:\\Users\\test",
      env: {
        SystemRoot: "C:\\Windows",
        ComSpec: "C:\\Windows\\System32\\cmd.exe",
      },
      existsSync: (p) => mockExists.has(normalize(p)),
      resolveCommand: (cmd) => {
        if (cmd === "powershell.exe") return "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
        if (cmd === "cmd.exe") return "C:\\Windows\\System32\\cmd.exe";
        return null;
      },
    };

    const detected = detectShellsInternal(deps).map(normalize);

    expect(detected).toEqual([
      normalize("C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"),
      normalize("C:\\Windows\\System32\\cmd.exe"),
    ]);
  });

  test("resolves Linux shells in correct priority order", () => {
    const mockExists = new Set<string>([
      "/bin/bash",
      "/bin/zsh",
      "/bin/sh",
    ]);

    const deps: ShellDetectionDeps = {
      platform: "linux",
      homedir: "/home/test",
      env: {
        SHELL: "/bin/zsh",
      },
      existsSync: (p) => mockExists.has(p),
      resolveCommand: (cmd) => {
        if (cmd === "bash") return "/bin/bash";
        if (cmd === "sh") return "/bin/sh";
        if (cmd === "zsh") return "/bin/zsh";
        return null;
      },
    };

    const detected = detectShellsInternal(deps);

    // Order should be: Bash -> login shell (/bin/zsh) -> sh
    expect(detected).toEqual([
      "/bin/bash",
      "/bin/zsh",
      "/bin/sh",
    ]);
  });

  test("resolves macOS shells correctly", () => {
    const mockExists = new Set<string>([
      "/bin/bash",
      "/bin/sh",
      "/bin/zsh",
      "/usr/local/bin/fish",
    ]);

    const deps: ShellDetectionDeps = {
      platform: "darwin",
      homedir: "/Users/test",
      env: {
        SHELL: "/usr/local/bin/fish",
      },
      existsSync: (p) => mockExists.has(p),
      resolveCommand: (cmd) => {
        if (cmd === "bash") return "/bin/bash";
        if (cmd === "sh") return "/bin/sh";
        if (cmd === "zsh") return "/bin/zsh";
        if (cmd === "fish") return "/usr/local/bin/fish";
        return null;
      },
    };

    const detected = detectShellsInternal(deps);

    expect(detected).toEqual([
      "/bin/bash",
      "/usr/local/bin/fish",
      "/bin/sh",
      "/bin/zsh",
    ]);
  });
});
