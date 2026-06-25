# Contributing to Megon

Thank you for your interest in contributing to Megon! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) runtime
- [Node.js](https://nodejs.org) >= 18.0.0 (for npm distribution)
- Git

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/MegonLabs/megon.git
   cd megon
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start development:
   ```bash
   bun run dev
   ```

## Development Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
3. Run tests:
   ```bash
   bun test
   ```

4. Commit your changes:
   ```bash
   git commit -m "feat: add your feature description"
   ```

5. Push to your fork and submit a pull request

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Code Style

- Use TypeScript
- Follow existing code patterns
- Keep changes focused and minimal
- Add tests for new features

## Reporting Issues

- Use the GitHub issue tracker
- Include steps to reproduce bugs
- Include your environment details

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
