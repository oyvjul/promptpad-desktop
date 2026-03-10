# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is this

PromptPad is a floating desktop prompt editor built with Electron + React. It's a frameless, always-on-top window for writing text with markdown syntax highlighting, token counting (tiktoken/GPT-4o), and one-key clipboard copy. The dock icon is hidden on macOS — the app lives as a togglable overlay.

## Commands

- `npm run dev` — Start development (electron-vite dev with hot reload)
- `npm run build` — Build for production (electron-vite build)
- `npm run dist:mac` / `npm run dist:win` — Package distributable (dmg/nsis)

No test runner or linter is configured.

## Architecture

Three-process Electron app using electron-vite:

- **Main** (`src/main/index.ts`): Single file. Creates a frameless BrowserWindow with platform-specific transparency (vibrancy on macOS, mica on Windows). Registers `Ctrl+Space` global shortcut to toggle visibility. Hides to tray instead of quitting. `copyAndHide()` reads the textarea value via `executeJavaScript` and copies to clipboard before hiding.
- **Preload** (`src/preload/index.ts`): Exposes `electronAPI` to renderer — clipboard write, hide/minimize/maximize IPC, and platform detection.
- **Renderer** (`src/renderer/`): React app, single `Editor` component as root. No router, no state management library.

### Build config

- electron-vite with React + WASM plugins (`electron.vite.config.ts`)
- electron-builder config in `electron-builder.yml` (dmg for macOS, nsis for Windows)
- TypeScript with separate configs: `tsconfig.node.json` (main/preload) and `tsconfig.web.json` (renderer)
