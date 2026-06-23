# sync

A monorepo for comparing local-first and sync engines (Electric SQL, Zero, Jazz, LiveStore, PowerSync, and more).

## Stack

- **Vite+** — dev, build, lint, format, and monorepo tasks (`vp`)
- **Bun** — package manager and workspaces
- **React + Vite** — demo apps
- **shadcn/ui** — shared components in `packages/ui`

## Structure

```
apps/
  web/              # hub app (starter)
packages/
  ui/               # shared shadcn components
```

## Development

```bash
bun install
vp dev              # start apps/web
vp check            # lint, format, typecheck
vp run -r build     # build all packages
```
