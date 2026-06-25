# sync

A monorepo for comparing local-first and sync engines. Each engine gets its own app under `apps/` implementing the same demo scenario where possible.

Open the hub at `apps/web` for the full comparison matrix with caveats and links.

## Stack

- **Vite+** — dev, build, lint, format, and monorepo tasks (`vp`)
- **Bun** — workspaces and package manager
- **React + Vite** — demo apps
- **shadcn/ui** — shared components in `packages/ui`

## Structure

```
apps/
  web/                  # hub — lists all implementations
  yjs/                  # doc demo
  automerge/
  actual-crdt/          # todo demo · uses @repo/crdt-core
  livestore/
  jazz/
  powersync/
  electric-tanstack/
  zero/
  convex/
  ditto/
packages/
  ui/                   # shared shadcn components
  demo/                 # shared todo + doc seed data
  crdt-core/            # DIY Actual-style HLC, merkle, field-LWW
servers/
  relay/                # message log for DIY CRDT demos
  yjs-ws/               # Yjs WebSocket server (@y/websocket-server, :8788)
infra/
  docker-compose.yml    # Postgres (+ engine profiles later)
tools/
  scaffold-apps.ts      # regenerate app scaffolds
```

## Development

```bash
bun install
bun run dev             # start apps/web hub
bun run dev:yjs-ws      # Yjs WebSocket server (ws://localhost:8788)
bun run check           # lint, format, typecheck
bun run build           # build all workspaces
```

Yjs client app: `bun run --filter app-yjs dev` (:5174). See `servers/yjs-ws/README.md`.

Use `bunx vp` if the `vp` binary is not on your PATH (Vite+ is installed locally).

---

## Engines under evaluation

### Document & collaborative editing

Best for rich text, multiplayer, and editor integrations (ProseMirror, Tiptap).

| Engine | Model | Key caveats |
|--------|-------|-------------|
| **[Y.js](https://github.com/yjs/yjs)** | Sequence CRDT · library | You build server, auth, persistence, presence. History grows. ProseMirror impedance mismatch. |
| **[Automerge](https://automerge.org/)** | JSON CRDT · local-first | History accumulation. WASM 4GB limit for huge docs. Sparse editor adapters. |
| **[Actual Budget CRDT](https://github.com/actualbudget/actual/tree/master/packages/crdt)** | Custom op-based · reference | Not a general SDK. Study merkle sync + HLCs, don't drop in blindly. |

### Local-first app sync

Embedded SQLite (or similar) on device with background sync.

| Engine | Model | Key caveats |
|--------|-------|-------------|
| **[LiveStore](https://livestore.dev/)** | Event sourcing → SQLite | Events + materializers boilerplate. No P2P. Growing eventlog. |
| **[Jazz](https://jazz.tools/)** | Embedded DB · tiered sync | LWW per field — bad for concurrent text in one field. Managed infra. |
| **[PowerSync](https://www.powersync.com/)** | Postgres → SQLite | You own conflict resolution. Logical replication ops. Row sync, not doc CRDT. |

### Postgres reactive sync

Postgres as source of truth with partial replication to clients.

| Engine | Model | Key caveats |
|--------|-------|-------------|
| **[Electric SQL + TanStack DB](https://electric-sql.com/)** | Read-path shapes + reactive store | Read-only sync path. You build writes. WAL slot ops. Shape edge cases. |
| **[Zero](https://zero.rocicorp.dev/)** | Postgres cache · ZQL | Not local-first. No offline writes. Postgres only. |

### Platforms & other

| Engine | Model | Key caveats |
|--------|-------|-------------|
| **[Convex](https://www.convex.dev/)** | Reactive backend | Not offline-first today. Collab docs need CRDTs or extra layers. |
| **[Ditto](https://www.ditto.com/)** | CRDT docs · P2P/edge | Avoid arrays. Document size limits. Denormalized modeling. |

---

## Taxonomy (quick reference)

```
Document CRDTs     →  Y.js, Automerge, Actual CRDT
App sync engines   →  LiveStore, Jazz, PowerSync
Postgres → client  →  Electric + TanStack DB, Zero
Platforms          →  Convex, Ditto
```

**Monorepo tooling:** Bun workspaces define packages; Vite+ (`vp run`) orchestrates tasks. No Turborepo.

---

## By client storage (web)

How data persists locally in the browser — often the most practical difference between engines.

| Storage | Engines | Notes |
|---------|---------|-------|
| **On-device SQLite (WASM)** | PowerSync, LiveStore | Real SQL on device. PowerSync default VFS stores SQLite *files* in IndexedDB; LiveStore uses OPFS. |
| **IndexedDB (native)** | Zero, Automerge | Key-value / document storage in IDB — not a SQL engine. Y.js via `y-indexeddb`. |
| **OPFS** | Jazz, LiveStore, PowerSync (optional) | Origin Private File System. Jazz uses a custom embedded DB on OPFS (not SQLite). |
| **In-memory** | Convex | No durable local persistence by default. |
| **Configurable** | Y.js, Electric+TanStack DB, Ditto | Depends on adapters — e.g. TanStack DB persistence, PGlite `idb://`, PowerSync OPFS vs IDB VFS. |

### SQLite vs IndexedDB — what's the difference?

- **IndexedDB** — browser's built-in object store. Good for documents/KV. Automerge and Zero use it directly.
- **On-device SQLite** — full SQL query engine running as WASM. PowerSync and LiveStore give you `SELECT`, indexes, joins locally.
- **The confusing middle** — PowerSync's *default* web setup is SQLite-on-IDB (`IDBBatchAtomicVFS`): you write SQL, but bytes live in IndexedDB. Optional OPFS VFS is faster.

**Native SQLite** (desktop/mobile only): Actual Budget, PowerSync React Native, Ditto mobile.

---

## Adding an engine demo

1. Create `apps/<slug>/` — Vite + React SPA wired to Vite+ (`vp dev`, `vp build`)
2. Depend on `@repo/ui` for shared components
3. Implement the shared demo scenario (TBD — likely a todo list or simple doc)
4. Add a row to `apps/web/src/data/engines.ts` and enable the hub button

Add shadcn components to the shared package:

```bash
cd packages/ui
bunx shadcn@latest add dialog --yes
```

---

## Why these categories matter

**Document editors** (Type.ai, Notion, Google Docs) need **sequence CRDTs** or OT for concurrent rich text — LWW field sync loses edits in the same paragraph.

**Postgres sync engines** (Electric, PowerSync, Zero) excel at **row/record replication** — different problem from character-level collaboration.

This repo exists to make those tradeoffs concrete with runnable demos, not just README comparisons.
