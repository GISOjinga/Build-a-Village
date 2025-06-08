# Road taken

This is a Roblox experience built with [roblox-ts](https://roblox-ts.com/). All TypeScript sources under `src/` compile to Luau scripts that are synced to Roblox via Rojo.

## Repository Structure

- **`src/client/`** – client only systems and React UI
- **`src/server/`** – server gameplay logic
- **`src/shared/`** – code shared by both sides (ECS components, networking, utilities)
- **`types/`** – additional global type declarations
- **`default.project.json`** – Rojo project configuration
- **`run.sh`** – helper script to install dependencies and start the compiler/watchers

## Getting Started

1. Install dependencies and build once:
   ```bash
   npm install && npm run build
   ```
2. During development you can watch for changes and serve the place via `io-serve`:
   ```bash
   npm run watch & npx io-serve
   ```
   (The included `run.sh` does all of this automatically.)

## Development Notes

- Make sure to clean up entities they cant clean themselves.
- Keep Matter component names consistent – the first word is always lower case.
- Document every function.
- Use named `export default function` declarations instead of anonymous exports so that system names show up in the debugger.
