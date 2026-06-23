# AGENTS.md

## Cursor Cloud specific instructions

This is a Bun + Vite+ (`vp`) monorepo for comparing local-first/sync engines. Workspaces live in `apps/*`, `packages/*`, and `tools/*`. The only runnable app today is `apps/web` (a React 19 + Vite hub UI), with shared shadcn/ui components in `packages/ui` (`@repo/ui`).

### Services / how to run

There is a single service: the `apps/web` dev server.

- Run dev server: `bun run dev` (alias for `vp run web#dev`) — serves on `http://localhost:5173/`.
- Lint/format/typecheck: `bun run check` (`vp check`) — runs `vp fmt --check`, `vp lint`, and type checks.
- Build everything: `bun run build` (`vp run -r build`) — runs `tsc -b` then `vp build` per package.

The `vp` CLI comes from the `vite-plus` dependency and is available at `node_modules/.bin/vp` after install; the `bun run *` scripts invoke it.

### Non-obvious caveats

- `bun` is installed under `~/.bun/bin` and is exported on `PATH` via `~/.bashrc` (added near the top, before the non-interactive early-return, so non-interactive shells also get it). If `bun` is ever not found, `export PATH="$HOME/.bun/bin:$PATH"`.
- Node on the base image is `v22.14.0`, slightly below `package.json` `engines` (`>=22.18.0`). This is only a hint and does not block install/build/run — all commands work.
- `bun run check` currently **fails on the committed code** due to pre-existing formatting and lint issues (not an environment problem): formatting diffs in several files, and one lint error in `apps/web/vite.config.ts` (`prefer-vite-plus-imports`: imports from `vite` instead of `vite-plus`). `git status` is clean after install, so these are repo issues, not setup artifacts. Do not "fix" them as part of unrelated work.
- shadcn `Card` styling in `packages/ui` does not fully render: `globals.css` (`packages/ui/src/styles/globals.css`) uses `@source "../../apps/**"` / `@source "../../packages/ui/src/**"` paths that resolve incorrectly relative to the CSS file, so Tailwind doesn't scan `packages/ui/src/components`. Utility classes used directly in `apps/web/src` are generated fine. This is a pre-existing app bug, not an environment issue.
