import { contextBridge, ipcRenderer } from "electron";

const allowedCommands = new Set([
  "MEGON_server_start",
  "browser_action",
  "get_projects",
  "save_project",
  "reorder_projects",
  "delete_project",
  "save_session_output",
  "load_session_output",
  "read_image_data_url",
  "get_available_shells",
  "list_skill_store",
  "install_skill",
  "uninstall_skill",
  "get_terminal_host_info",
  "probe_cli_tools",
  "set_project_watch",
  "list_directory",
  "read_text_file",
  "get_git_branch",
  "get_git_branches",
  "get_git_status",
  "get_git_file_base",
  "get_git_file_state",
  "switch_git_branch",
  "cleanup_runtime",
  "set_window_background",
  "set_browser_theme",
  "set_titlebar_theme",
  "minimize_window",
  "toggle_maximize_window",
  "is_window_maximized",
  "close_window",
  "reveal_in_finder",
  "open_project_with",
  "list_open_with_apps",
  "show_open_dialog",
  "open_external",
  "get_app_info",
  "storage_set",
  "storage_remove",
  "check_for_updates",
  "install_update",
  "download_update",
  "list_work_terminals",
  "create_work_terminal",
  "update_work_terminal",
  "reorder_work_terminals",
  "delete_work_terminal",
  "get_terminal_layout",
  "save_terminal_layout",
]);

const eventSubscriptions = new Map<string, Set<(data: any) => void>>();
const terminalDataSubscriptions = new Map<string, Set<(data: string) => void>>();
const terminalExitSubscriptions = new Map<string, Set<() => void>>();

ipcRenderer.on("megon:event", (_event, message) => {
  const listeners = eventSubscriptions.get(message.channel);
  if (!listeners) return;
  for (const listener of listeners) {
    Promise.resolve()
      .then(() => listener({ payload: message.payload }))
      .catch((error) => {
      console.error("megon:event listener failed", error);
    });
  }
});

ipcRenderer.on("megon:terminal-data", (_event, message) => {
  const listeners = terminalDataSubscriptions.get(message.id);
  if (!listeners) return;
  for (const listener of listeners) {
    Promise.resolve()
      .then(() => listener(message.data))
      .catch((error) => {
      console.error("megon:terminal-data listener failed", error);
    });
  }
});

ipcRenderer.on("megon:terminal-exit", (_event, message) => {
  const listeners = terminalExitSubscriptions.get(message.id);
  if (!listeners) return;
  for (const listener of listeners) {
    Promise.resolve()
      .then(() => listener())
      .catch((error) => {
      console.error("megon:terminal-exit listener failed", error);
    });
  }
});

function subscribe<T>(map: Map<string, Set<(value: T) => void>>, key: string, callback: (value: T) => void) {
  const listeners = map.get(key) || new Set();
  listeners.add(callback);
  map.set(key, listeners);
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) map.delete(key);
  };
}

contextBridge.exposeInMainWorld("megon", {
  platform: process.platform === "win32" ? "windows" : process.platform === "darwin" ? "macos" : process.platform,
  getServerUrl: () => ipcRenderer.sendSync("megon:get-megon-server-url"),
  invoke(command: string, payload: unknown) {
    if (!allowedCommands.has(command)) {
      return Promise.reject(new Error(`IPC command is not allowed: ${command}`));
    }
    return ipcRenderer.invoke("megon:invoke", command, payload);
  },
  listen(channel: string, callback: (message: unknown) => void) {
    return Promise.resolve(subscribe(eventSubscriptions, channel, callback));
  },
  storage: {
    getItem: (storage: string | undefined, key: string) =>
      ipcRenderer.sendSync("megon:storage-get", storage ?? null, key) as string | null,
    setItem: (storage: string | undefined, key: string, value: string) =>
      ipcRenderer.invoke("megon:invoke", "storage_set", { storage: storage ?? null, key, value }),
    removeItem: (storage: string | undefined, key: string) =>
      ipcRenderer.invoke("megon:invoke", "storage_remove", { storage: storage ?? null, key }),
  },
  window: {
    minimize: () => ipcRenderer.invoke("megon:invoke", "minimize_window", {}),
    toggleMaximize: () => ipcRenderer.invoke("megon:invoke", "toggle_maximize_window", {}),
    isMaximized: () => ipcRenderer.invoke("megon:invoke", "is_window_maximized", {}),
    close: () => ipcRenderer.invoke("megon:invoke", "close_window", {}),
    onResized: (callback: (state?: { maximized?: boolean; fullscreen?: boolean }) => void) => {
      const listener = (_event: unknown, state: { maximized?: boolean; fullscreen?: boolean }) => callback(state);
      ipcRenderer.on("megon:window-state", listener);
      return Promise.resolve(() => ipcRenderer.removeListener("megon:window-state", listener));
    },
  },
  terminal: {
    spawn: (options: unknown) => ipcRenderer.invoke("megon:terminal-spawn", options),
    write: (id: string, data: string) => ipcRenderer.invoke("megon:terminal-write", id, data),
    resize: (id: string, cols: number, rows: number) => ipcRenderer.invoke("megon:terminal-resize", id, cols, rows),
    kill: (id: string) => ipcRenderer.invoke("megon:terminal-kill", id),
    onData: (id: string, callback: (data: string) => void) => subscribe(terminalDataSubscriptions, id, callback),
    onExit: (id: string, callback: () => void) => subscribe(terminalExitSubscriptions, id, callback),
  },
});
