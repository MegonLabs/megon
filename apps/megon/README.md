<div align="center">

<img width="120" alt="Megon" src="https://megon.org/logo.png" />

# Megon

**The AI Agent Workspace for Developers**

Run multiple AI agents in parallel. Review every change. Ship faster.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/megon.svg)](https://www.npmjs.com/package/megon)
[![Beta](https://img.shields.io/badge/status-beta-orange)]()
[![Discord](https://img.shields.io/badge/discord-join-7289da)](https://megon.org/discord)

[Website](https://megon.org) · [Download](https://megon.org/download) · [Docs](https://megon.org/docs) · [GitHub](https://github.com/MegonLabs/megon)

</div>

---

## Why Megon?

AI coding tools are powerful, but managing multiple agents across different windows is chaos. Megon puts everything in one place - parallel agents, live terminal output, permission gates, and diff review - so you stay in control while your agents do the work.

**Key benefits:**
- **Ship faster** - Run multiple agents in parallel instead of one at a time
- **Stay in control** - Every command and file edit goes through permission gates
- **See everything** - Real-time terminal output, live diffs, and session history
- **Works everywhere** - macOS, Linux, Windows. Any AI provider.

---

## What is Megon?

Megon is a desktop app that lets you run **multiple AI coding agents at the same time** - inside a single workspace, on the same project.

Instead of switching between chat windows, terminals, and diff viewers, Megon gives you one place to:

- Send tasks to multiple agents in parallel
- Watch them work in real time
- Review every file change and terminal command before it happens
- Manage sessions, branches, and context without leaving the app

Think of it as a control center for AI-assisted development.

---

## Quick Demo

```bash
# Start Megon and begin a coding session
megon

# Chat with an agent about your codebase
megon chat

# Launch an autonomous agent for a complex task
megon agent "refactor the authentication module"

# Check system health and configuration
megon doctor

# Update to the latest version
megon update
```

### What It Looks Like

```text
┌─────────────────────────────────────────────────────┐
│  Megon v1.0.0              [anthropic/claude-4]     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  > Refactor the auth module to use JWT tokens       │
│                                                     │
│  Agent 1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 87%    │
│  Agent 2 ━━━━━━━━━━━━━━━━━━━━━━━━ 65%              │
│  Agent 3 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 92%    │
│                                                     │
│  ✓ 3 files modified  │  ⏳ 2 pending review         │
│                                                     │
├─────────────────────────────────────────────────────┤
│  [Approve]  [Reject]  [Review Changes]              │
└─────────────────────────────────────────────────────┘
```

---

## Screenshots

<!-- Add screenshots or GIFs here when available -->

| Interactive Chat | Agent Mode |
|:---:|:---:|
| ![Chat](https://megon.org/screenshots/chat.png) | ![Agent](https://megon.org/screenshots/agent.png) |

| Tool Execution | Project Analysis |
|:---:|:---:|
| ![Tools](https://megon.org/screenshots/tools.png) | ![Analysis](https://megon.org/screenshots/analysis.png) |

> **Note:** Screenshots are placeholders. Replace with actual screenshots before public launch.

---

## Features

### Parallel Agent Sessions

Run 2, 5, or 10 agents at once. Each gets its own session with full context. Work on a bug fix, write tests, update docs, and refactor code - all simultaneously.

### Permission System

Nothing happens without your approval. Every shell command, file edit, and API call goes through a permission gate. You decide what's allowed, what needs review, and what's blocked.

```jsonc
{
  "permission": {
    "bash": "ask",      // Ask before running shell commands
    "edit": "allow",    // Auto-allow file edits
    "read": "allow",    // Auto-allow file reads
    "write": "ask"      // Ask before creating new files
  }
}
```

### Built-in Terminal

Full PTY terminal support with xterm.js. Agents can run commands, and you see the output live. Resize, scroll, and interact just like a real terminal.

### Git Integration

Megon reads your branch, staged changes, and commit history. Agents understand your repo context and work within your workflow - not against it.

### Diff Viewer

Review code changes side-by-side before accepting. See exactly what each agent modified, when, and why.

### MCP Support

Connect external tools and services via the Model Context Protocol. Extend what your agents can do without modifying Megon itself.

```jsonc
{
  "mcp": {
    "github": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    },
    "database": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-postgres"],
      "env": { "DATABASE_URL": "${DATABASE_URL}" }
    }
  }
}
```

### Skills System

Define reusable workflows as skills. Skills are markdown files that teach agents how to handle specific tasks - from brainstorming to deep research to UI design.

```text
skills/
├── brainstorming/SKILL.md
├── deep-research-agent/SKILL.md
├── frontend-design/SKILL.md
├── improve/SKILL.md
├── memory/SKILL.md
└── ui-ux-pro-max/SKILL.md
```

Create your own by adding a `SKILL.md` to any directory. See the [Skills Guide](https://megon.org/docs/skills) for the format.

### Plugin Architecture

Build your own plugins to add tools, UI panels, or provider integrations. The plugin SDK gives you full access to the agent runtime.

```typescript
import { defineTool } from "@megon/plugin/tool"

export default defineTool({
  name: "my-custom-tool",
  description: "Does something useful",
  parameters: { /* zod schema */ },
  async execute(params, ctx) {
    // Your tool logic here
    return { result: "done" }
  },
})
```

---

## Supported AI Providers

Megon works with all major AI providers out of the box:

| Provider | Models |
|----------|--------|
| Anthropic | Claude 4, Claude 3.5 Sonnet, Claude 3 Opus |
| OpenAI | GPT-4o, o1, o3 |
| Google | Gemini 2.5 Pro, Gemini 2.0 Flash |
| xAI | Grok 3 |
| AWS Bedrock | Claude, Llama, Mistral |
| Azure OpenAI | GPT-4o, GPT-4 Turbo |
| OpenRouter | 100+ models |
| Groq | Llama 3, Mixtral |
| Cohere | Command R+ |
| Mistral | Mistral Large, Codestral |
| Together AI | Llama, Mixtral, CodeLlama |
| Perplexity | Sonar, Sonar Pro |

You can also connect any OpenAI-compatible API as a custom provider.

---

## Installation

### Download (Recommended)

Grab the latest release for your platform:

- **Windows**: [Download installer](https://megon.org/download/windows)
- **macOS**: [Download .dmg](https://megon.org/download/mac)
- **Linux**: [Download AppImage](https://megon.org/download/linux)

### CLI Only

Install the standalone CLI agent:

```bash
npm install -g megon
megon --help
```

### Verify Installation

```bash
# Check version
megon --version

# Run health check
megon doctor
```

Expected output:

```text
megon 1.0.0
Node.js 20.x.x
Platform: darwin-arm64
Config: ~/.config/megon/megon.json ✓
API Key: configured ✓
```

### From Source

Clone the repo and build locally:

```bash
git clone https://github.com/MegonLabs/megon.git
cd megon
bun install
bun run build
```

---

## Configuration

Megon uses a JSON config file at `~/.config/megon/megon.json`:

```jsonc
{
  "$schema": "https://megon.org/config.json",
  // Model to use (provider/model format)
  "model": "anthropic/claude-sonnet-4-20250514",

  // Server settings
  "server": {
    "port": 3000,
    "hostname": "127.0.0.1"
  },

  // Permission rules
  "permission": {
    "bash": "ask",
    "edit": "allow",
    "read": "allow"
  },

  // MCP servers
  "mcp": {
    "my-tool": {
      "type": "local",
      "command": ["node", "my-tool.js"]
    }
  }
}
```

See the [full config reference](https://megon.org/docs/config) for all options.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MEGON_CONFIG` | Path to config file | `~/.config/megon/megon.json` |
| `MEGON_CONFIG_DIR` | Config directory | `~/.config/megon` |
| `MEGON_CHANNEL` | Release channel | `local` |
| `MEGON_PURE` | Disable all plugins | `false` |
| `ANTIGRAVITY_CLIENT_ID` | Google AI OAuth client ID | N/A |
| `ANTIGRAVITY_CLIENT_SECRET` | Google AI OAuth client secret | N/A |

---

## CLI Reference

### Global Options

```text
megon [command] [options]

Commands:
  megon                    Start the interactive TUI
  megon chat               Open a chat session
  megon agent <task>       Launch an autonomous agent
  megon doctor             Check system health
  megon update             Update to latest version
  megon config             Manage configuration
  megon models             List available AI models
  megon plugins            Manage plugins
  megon mcp                Manage MCP servers

Options:
  --version                Show version number
  --help                   Show help
  --config <path>          Use a custom config file
```

### Examples

```bash
# Start with a specific model
megon --model anthropic/claude-sonnet-4-20250514

# Run a one-shot task
megon agent "add unit tests for the auth module"

# List available models
megon models

# Check configuration
megon config show

# Reset configuration
megon config reset
```

---

## Development

Megon is a monorepo built with [Bun](https://bun.sh) and [Turborepo](https://turbo.build).

### Prerequisites

- [Bun](https://bun.sh) 1.3+
- [Node.js](https://nodejs.org) 20+
- [Git](https://git-scm.com)

### Quick Start

```bash
# Clone and install
git clone https://github.com/MegonLabs/megon.git
cd megon
bun install

# Start the desktop app in dev mode
bun run dev

# Or run just the CLI
bun run cli
```

### Project Structure

```text
megon/
├── apps/
│   ├── desktop/          # Electron + SolidJS desktop app
│   └── megon/            # CLI agent (standalone binary)
│
├── packages/
│   ├── server/           # Core AI agent runtime (Hono + Effect)
│   ├── sdk/              # Auto-generated API client (OpenAPI)
│   ├── ui/               # Shared UI components (SolidJS + Kobalte)
│   ├── plugin/           # Plugin SDK for extending Megon
│   ├── script/           # Shared build script utilities
│   └── util/             # Shared utility functions
│
├── skills/               # Built-in agent skills (markdown-defined)
├── scripts/              # Build and dev scripts
└── docs/                 # Design specs and architecture docs
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Desktop shell | Electron |
| UI framework | SolidJS + Kobalte |
| Styling | Tailwind CSS |
| Terminal | xterm.js |
| Server runtime | Hono + Effect |
| Database | SQLite (via Drizzle ORM) |
| Build tool | Bun (compile to native binary) |
| Monorepo | Turborepo |
| Language | TypeScript |

### Useful Commands

| Command | What it does |
|---------|-------------|
| `bun install` | Install all dependencies |
| `bun run dev` | Start desktop app in dev mode |
| `bun run build` | Build desktop app for production |
| `bun run build:electron` | Build packaged Electron app |
| `bun run cli` | Run the CLI agent |
| `bun run test` | Run all tests |
| `bun run lint` | Run ESLint |
| `bun run preview` | Preview production build |

### Package Overview

| Package | Purpose | Path |
|---------|---------|------|
| `@megon/server` | AI agent runtime, tools, providers, sessions | `packages/server` |
| `@megon/sdk` | TypeScript API client (auto-generated) | `packages/sdk` |
| `@megon/ui` | SolidJS component library | `packages/ui` |
| `@megon/plugin` | Plugin development SDK | `packages/plugin` |
| `@megon/script` | Shared build script utilities | `packages/script` |
| `@megon/util` | Shared utilities (path, encode, retry) | `packages/util` |
| `megon` | CLI agent binary | `apps/megon` |
| `megon-desktop` | Electron desktop app | `apps/desktop` |

### Building the CLI Binary

The CLI is compiled to a standalone native binary using Bun:

```bash
# Build for current platform
cd apps/megon
bun run build

# The binary is at dist/bin/megon
./dist/bin/megon --version
```

### Running Tests

```bash
# Run all tests
bun run test

# Run tests for a specific package
cd packages/server && bun test

# Run with coverage
cd packages/server && bun test --coverage
```

---

## Architecture

### How It Works

```text
┌─────────────────────────────────────────────┐
│              Desktop App (Electron)          │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │  SolidJS UI  │  │   Embedded Server    │  │
│  │  (renderer)  │──│   (@megon/server)    │  │
│  └─────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────┘
                          │
                ┌─────────┴─────────┐
                │   AI Providers    │
                │  Anthropic, OpenAI│
                │  Google, etc.     │
                └───────────────────┘
```

The desktop app embeds the server as a sidecar process. The server handles all AI interactions, tool execution, and session management. The UI communicates with the server via HTTP/WebSocket.

### Key Concepts

- **Session**: A conversation thread with an AI agent. Each session tracks messages, tool calls, and file changes.
- **Agent**: A configured AI persona with specific tools, permissions, and model settings.
- **Skill**: A reusable workflow defined in markdown. Skills teach agents how to handle specific tasks.
- **Plugin**: A TypeScript module that adds tools, UI panels, or provider integrations.
- **MCP**: Model Context Protocol - a standard for connecting external tools to AI agents.

### Data Flow

```text
User Input → Desktop UI → Server API → Agent Runtime
                                           │
                                    ┌──────┴──────┐
                                    │   Tools     │
                                    │  - bash     │
                                    │  - edit     │
                                    │  - read     │
                                    │  - grep     │
                                    │  - glob     │
                                    │  - apply_patch │
                                    └──────┬──────┘
                                           │
                                    File System
                                    Git Repository
```

---

## Contributing

We welcome contributions! Here's how to get started:

### First-Time Setup

```bash
# Fork and clone
git clone https://github.com/<your-username>/megon.git
cd megon

# Install dependencies
bun install

# Create a branch
git checkout -b feat/my-feature

# Start dev mode
bun run dev
```

### Making Changes

1. **Pick an issue** - Check [open issues](https://github.com/MegonLabs/megon/issues) or create one
2. **Create a branch** - `git checkout -b feat/my-feature`
3. **Make changes** - Follow existing code patterns
4. **Write tests** - `cd packages/server && bun test`
5. **Commit** - Use [conventional commits](https://www.conventionalcommits.org/):
   ```bash
   # feat: new feature
   # fix: bug fix
   # docs: documentation only
   # refactor: code change that neither fixes a bug nor adds a feature
   # test: adding or updating tests
   # chore: maintenance tasks

   git commit -m "feat: add custom tool support"
   ```
6. **Push and open a PR**

### Development Guidelines

- Follow existing code patterns and conventions
- Write tests for new features
- Keep PRs focused - one change per PR
- Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- Run `bun run test` before pushing
- Update documentation if your change affects user-facing behavior

### Adding a Plugin

See the [Plugin SDK docs](https://megon.org/docs/plugins) or start from the template:

```typescript
// packages/plugin/src/index.ts
import { defineTool } from "@megon/plugin/tool"

export const myPlugin = defineTool({
  name: "my-tool",
  description: "What this tool does",
  parameters: z.object({ /* ... */ }),
  async execute(params, ctx) {
    return { result: "..." }
  },
})
```

### Adding a Skill

Create a markdown file at `skills/<your-skill>/SKILL.md`:

```markdown
---
name: my-skill
description: What this skill teaches agents
---

# My Skill

When the user asks to do X, follow these steps:

1. First, analyze the codebase
2. Then, make the necessary changes
3. Finally, verify the result
```

---

## Troubleshooting

### Common Issues

**"Megon CLI binary was not found"**
```bash
# Rebuild the binary
cd apps/megon && bun run build
```

**"API Key not configured"**
```bash
# Set your API key
megon config set model anthropic/claude-sonnet-4-20250514
# Then add your API key to the config file
```

**"Permission denied" on macOS/Linux**
```bash
# Make the binary executable
chmod +x $(which megon)
```

**Desktop app won't start**
```bash
# Clean and rebuild
bun run clean
bun install
bun run build
```

### Getting Help

- **Discord**: [Join the community](https://megon.org/discord)
- **GitHub Issues**: [Report a bug](https://github.com/MegonLabs/megon/issues)
- **Security**: [Report a vulnerability](https://github.com/MegonLabs/megon/security/advisories/new)

---

## Security

If you discover a security vulnerability, please **do not** open a public issue. Instead, report it through [GitHub Security Advisories](https://github.com/MegonLabs/megon/security/advisories/new).

See [SECURITY.md](SECURITY.md) for details.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with care by [MegonLabs](https://github.com/MegonLabs)**

[https://megon.org](https://megon.org)

</div>
