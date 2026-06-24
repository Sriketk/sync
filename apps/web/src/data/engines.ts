export type EngineCategory =
  | "document"
  | "local-first"
  | "postgres-sync"
  | "platform";

/** How data is persisted on the client (web-first). */
export type ClientStorageGroup =
  | "indexeddb"
  | "sqlite-on-device"
  | "opfs"
  | "in-memory"
  | "configurable";

export type ClientStorage = {
  group: ClientStorageGroup;
  /** Short label shown on cards, e.g. "IndexedDB" or "SQLite (WASM) → OPFS" */
  web: string;
  /** Extra nuance — e.g. SQLite backed by IndexedDB vs OPFS */
  notes?: string;
};

export type EngineDemo = "todo" | "doc";

export type EngineStatus = "scaffolded" | "wip" | "done";

export type Engine = {
  id: string;
  name: string;
  slug: string;
  category: EngineCategory;
  demo: EngineDemo;
  status: EngineStatus;
  port: number;
  storage: ClientStorage;
  model: string;
  summary: string;
  caveats: string[];
  links: { label: string; href: string }[];
  interviewNote?: string;
};

export const storageGroupLabels: Record<ClientStorageGroup, string> = {
  indexeddb: "IndexedDB",
  "sqlite-on-device": "On-device SQLite",
  opfs: "OPFS (embedded DB)",
  "in-memory": "In-memory (default)",
  configurable: "Configurable / hybrid",
};

export const storageGroupDescriptions: Record<ClientStorageGroup, string> = {
  indexeddb:
    "Browser IndexedDB API — either native key-value/doc storage or as the persistence layer underneath WASM SQLite.",
  "sqlite-on-device":
    "Real SQLite (or Postgres-in-WASM like PGlite) running on device. On web this is WASM + a virtual filesystem (OPFS or IndexedDB).",
  opfs:
    "Origin Private File System — file-backed storage in the browser. Jazz and LiveStore use OPFS; PowerSync can opt into OPFS VFS.",
  "in-memory":
    "No durable local persistence by default — data lost on refresh unless you add a layer.",
  configurable:
    "Multiple storage backends depending on config, platform, or optional adapters.",
};

export const categoryLabels: Record<EngineCategory, string> = {
  document: "Document & collaborative editing",
  "local-first": "Local-first app sync",
  "postgres-sync": "Postgres reactive sync",
  platform: "Platforms & other",
};

export const categoryDescriptions: Record<EngineCategory, string> = {
  document:
    "CRDTs and custom sync for rich text, structured docs, and multiplayer editing.",
  "local-first":
    "Embedded SQLite (or similar) on device with background sync to a backend.",
  "postgres-sync":
    "Postgres as source of truth with partial replication to clients.",
  platform:
    "Full-stack or edge platforms — sync-adjacent, not always local-first.",
};

export const engines: Engine[] = [
  {
    id: "yjs",
    name: "Y.js",
    slug: "yjs",
    demo: "doc",
    status: "scaffolded",
    port: 5174,
    category: "document",
    storage: {
      group: "configurable",
      web: "In-memory · optional IndexedDB",
      notes: "Persist with y-indexeddb. CRDT state is not SQL.",
    },
    model: "Sequence CRDT · library",
    summary:
      "Dominant CRDT for collaborative text. Integrates with ProseMirror, Tiptap, and CodeMirror.",
    caveats: [
      "Data structure only — you build WebSocket server, auth, persistence, and presence.",
      "Document history grows (tombstones); needs periodic compaction.",
      "Yjs ↔ ProseMirror impedance mismatch for tree-shaped schemas.",
      "Production scaling needs Redis/pub-sub; y-websocket is not enough alone.",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/yjs/yjs" },
      {
        label: "y-prosemirror caveats",
        href: "https://github.com/yjs/y-prosemirror/blob/master/CAVEATS.md",
      },
    ],
    interviewNote:
      "Closest fit for document editors — likely what teams like Type evaluate for multiplayer rich text.",
  },
  {
    id: "automerge",
    name: "Automerge",
    slug: "automerge",
    demo: "doc",
    status: "scaffolded",
    port: 5175,
    category: "document",
    storage: {
      group: "indexeddb",
      web: "IndexedDB",
      notes: "automerge-repo-storage-indexeddb. Node: filesystem adapter.",
    },
    model: "JSON CRDT · local-first",
    summary:
      "Local-first JSON documents with full change history. Automerge 3 dramatically improved memory use.",
    caveats: [
      "History accumulates — long-lived docs can grow large without compaction strategy.",
      "WASM 4GB memory ceiling in browser for very large documents.",
      "Fewer editor adapters than Yjs — you wire ProseMirror yourself.",
      "automerge-repo helps but networking/storage is still on you.",
    ],
    links: [
      { label: "Automerge", href: "https://automerge.org/" },
      {
        label: "Automerge 3 blog",
        href: "https://automerge.org/blog/automerge-3/",
      },
    ],
    interviewNote:
      "Good CRDT tradeoff discussion: history vs compaction, JSON docs vs text sequences.",
  },
  {
    id: "actual-crdt",
    name: "Actual Budget CRDT",
    slug: "actual-crdt",
    demo: "todo",
    status: "scaffolded",
    port: 5176,
    category: "document",
    storage: {
      group: "sqlite-on-device",
      web: "Native SQLite",
      notes: "loot-core SQLite in Electron/desktop — not a typical web stack.",
    },
    model: "Custom op-based CRDT · reference impl",
    summary:
      "Production CRDT from Actual Budget — protobuf messages, merkle trees, hybrid logical clocks.",
    caveats: [
      "@actual-app/crdt is not a general SDK — usage outside Actual is undocumented.",
      "Tied to Actual's field-level operation model and desktop heritage.",
      "Best treated as a case study, not a drop-in npm package for new apps.",
    ],
    links: [
      {
        label: "Using CRDTs in the wild",
        href: "https://archive.jlongster.com/using-crdts-in-the-wild",
      },
      {
        label: "packages/crdt",
        href: "https://github.com/actualbudget/actual/tree/master/packages/crdt",
      },
    ],
    interviewNote:
      "Strong 'CRDTs in production' story — merkle sync, HLCs, field-level ops.",
  },
  {
    id: "livestore",
    name: "LiveStore",
    slug: "livestore",
    demo: "todo",
    status: "scaffolded",
    port: 5177,
    category: "local-first",
    storage: {
      group: "sqlite-on-device",
      web: "SQLite (WASM) → OPFS",
      notes: "wa-sqlite fork. Web adapter uses OPFS only today (not IndexedDB).",
    },
    model: "Event sourcing → SQLite",
    summary:
      "Commit events, materialize into reactive SQLite on device. Git-inspired push/pull sync.",
    caveats: [
      "Event sourcing boilerplate — events, materializers, growing eventlog.",
      "Not batteries-included (no auth); no P2P — needs a sync backend.",
      "Younger ecosystem than Yjs or PowerSync.",
    ],
    links: [
      { label: "LiveStore", href: "https://livestore.dev/" },
      { label: "How it works", href: "https://docs.livestore.dev/overview/how-livestore-works/" },
    ],
    interviewNote:
      "Contrast event sourcing vs CRDT for revision history and AI edit trails.",
  },
  {
    id: "jazz",
    name: "Jazz",
    slug: "jazz",
    demo: "todo",
    status: "scaffolded",
    port: 5178,
    category: "local-first",
    storage: {
      group: "opfs",
      web: "OPFS embedded DB",
      notes: "Custom relational engine on OPFS — not SQLite. RN uses native storage.",
    },
    model: "Embedded DB · tiered sync",
    summary:
      "Batteries-included local-first — OPFS in browser, immediate reads/writes, background sync.",
    caveats: [
      "Last-writer-wins per field — wrong semantics for concurrent text in one field.",
      "Eventual consistency across local/edge/global tiers.",
      "Managed sync infrastructure — less bring-your-own-Postgres.",
    ],
    links: [
      { label: "Jazz", href: "https://jazz.tools/" },
      {
        label: "How sync works",
        href: "https://jazz.tools/docs/concepts/how-sync-works",
      },
    ],
    interviewNote: "LWW simplicity vs CRDT semantics for collaborative editing.",
  },
  {
    id: "powersync",
    name: "PowerSync",
    slug: "powersync",
    demo: "todo",
    status: "scaffolded",
    port: 5179,
    category: "local-first",
    storage: {
      group: "sqlite-on-device",
      web: "SQLite (WASM)",
      notes:
        "Default: IDBBatchAtomicVFS (SQLite files in IndexedDB). Optional OPFS VFS for perf.",
    },
    model: "Postgres → SQLite · bidirectional",
    summary:
      "Mature sync engine — partial replication via sync rules, full offline SQLite on client.",
    caveats: [
      "You implement conflict resolution on the server write path.",
      "Postgres logical replication ops — WAL, slots, DDL not in stream.",
      "Row/record sync — not character-level collaborative text.",
      "Some serverless Postgres providers lack logical replication.",
    ],
    links: [
      { label: "PowerSync", href: "https://www.powersync.com/" },
      {
        label: "Postgres replication challenges",
        href: "https://www.powersync.com/blog/postgres-logical-replication-challenges-solutions",
      },
    ],
    interviewNote:
      "Gold standard for structured offline data — wrong layer for ProseMirror doc sync.",
  },
  {
    id: "electric-tanstack",
    name: "Electric SQL + TanStack DB",
    slug: "electric-tanstack",
    demo: "todo",
    status: "scaffolded",
    port: 5180,
    category: "postgres-sync",
    storage: {
      group: "configurable",
      web: "In-memory · optional SQLite",
      notes:
        "Electric shapes stream to memory by default. TanStack DB 0.6+ can persist collections; PGlite adds Postgres-in-WASM (idb:// or memory).",
    },
    model: "Read-path shapes · reactive client store",
    summary:
      "Electric syncs Postgres rows via HTTP shapes; TanStack DB adds reactive collections and optimistic UX.",
    caveats: [
      "Electric is read-path only — you build writes and conflict strategy.",
      "Consumes a Postgres logical replication slot — monitor WAL retention.",
      "Shape limitations — mostly single-table; subquery/CASCADE delete edge cases.",
      "Optimistic writes need txid matching or custom awaitMatch logic.",
    ],
    links: [
      { label: "Electric", href: "https://electric-sql.com/" },
      { label: "TanStack DB + Electric", href: "https://tanstack.com/db/latest/docs/collections/electric-collection" },
    ],
    interviewNote: "Postgres fan-out vs CRDT — won't solve offline doc editing alone.",
  },
  {
    id: "zero",
    name: "Zero",
    slug: "zero",
    demo: "todo",
    status: "scaffolded",
    port: 5181,
    category: "postgres-sync",
    storage: {
      group: "indexeddb",
      web: "IndexedDB",
      notes: "Default kvStore: 'idb'. Server zero-cache uses SQLite. RN: expo/op-sqlite.",
    },
    model: "Postgres cache · ZQL · server-authoritative",
    summary:
      "Rocicorp sync engine — local SQLite replica, instant reads, optimistic writes, reactive ZQL.",
    caveats: [
      "Not local-first — authoritative server (per Rocicorp docs).",
      "No offline writes — read-only while offline.",
      "Postgres only; no views; some column types unsupported.",
      "Recommended for datasets under ~100GB today.",
    ],
    links: [
      { label: "Zero", href: "https://zero.rocicorp.dev/" },
      {
        label: "When to use Zero",
        href: "https://zero.rocicorp.dev/docs/when-to-use",
      },
    ],
    interviewNote: "Negative example for offline writing — sync cache, not local-first.",
  },
  {
    id: "convex",
    name: "Convex",
    slug: "convex",
    demo: "todo",
    status: "scaffolded",
    port: 5182,
    category: "platform",
    storage: {
      group: "in-memory",
      web: "In-memory",
      notes: "Reactive client cache — not durable offline-first. Pair with Replicache/CRDTs for that.",
    },
    model: "Reactive backend · not a sync engine",
    summary:
      "Queries push to client, mutations queue to server. Great DX for real-time full-stack apps.",
    caveats: [
      "Not true local-first — handles network blips, not sustained offline writes.",
      "Collab doc examples use in-memory state; durable offline needs extra work.",
      "For offline, teams often pair with Replicache or CRDTs on top.",
    ],
    links: [
      { label: "Convex", href: "https://www.convex.dev/" },
      { label: "A Map of Sync", href: "https://stack.convex.dev/a-map-of-sync" },
    ],
    interviewNote: "Reactive server platform — different problem than device-owned data.",
  },
  {
    id: "ditto",
    name: "Ditto",
    slug: "ditto",
    demo: "todo",
    status: "scaffolded",
    port: 5183,
    category: "platform",
    storage: {
      group: "configurable",
      web: "Embedded CRDT store",
      notes: "Platform-managed persistence — SQLite on mobile, embedded store on web/SDK.",
    },
    model: "CRDT documents · P2P / edge",
    summary:
      "Offline-first CRDT platform with peer-to-peer mesh and field-level merge semantics.",
    caveats: [
      "Avoid arrays for concurrent writes — use maps keyed by ID.",
      "Document size limits (~256KB soft, 5MB hard).",
      "Denormalized document modeling — different from relational Postgres thinking.",
      "Less common in web document editor workflows.",
    ],
    links: [
      { label: "Ditto", href: "https://www.ditto.com/" },
      {
        label: "Conflict resolution",
        href: "https://docs.ditto.live/best-practices/conflict-resolution-patterns",
      },
    ],
    interviewNote: "Edge/P2P merge semantics — interesting contrast, different domain than web editors.",
  },
];

export const enginesByCategory = (
  Object.keys(categoryLabels) as EngineCategory[]
).map((category) => ({
  category,
  label: categoryLabels[category],
  description: categoryDescriptions[category],
  engines: engines.filter((e) => e.category === category),
}));

export const enginesByStorage = (
  Object.keys(storageGroupLabels) as ClientStorageGroup[]
).map((group) => ({
  group,
  label: storageGroupLabels[group],
  description: storageGroupDescriptions[group],
  engines: engines.filter((e) => e.storage.group === group),
}));

/** Display order for storage pills on cards */
export const storageGroupOrder: ClientStorageGroup[] = [
  "sqlite-on-device",
  "indexeddb",
  "opfs",
  "in-memory",
  "configurable",
];
