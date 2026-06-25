# yjs-ws

Official Yjs WebSocket server for `apps/yjs` (and other doc CRDT demos).

Uses [`@y/websocket-server`](https://github.com/yjs/y-websocket) — speaks the `y-protocols` sync wire format. The old Bun pub/sub placeholder did **not** work with `WebsocketProvider`.

This server pulls in `@y/y` (Yjs v14) — required by current `@y/protocols`. Your client can use the `yjs` v13 package; the wire format is compatible.

## Run

From repo root:

```bash
bun run dev:yjs-ws
```

Or from this folder:

```bash
bun run dev
```

Defaults: `ws://localhost:8788`

Override with env (see `infra/.env.example`):

```bash
HOST=0.0.0.0 PORT=8788 bun run dev
```

HTTP GET on the same port returns `okay` (health check).

## Connect from the client

In `apps/yjs`, once you add deps:

```bash
cd apps/yjs
bun add yjs y-websocket
```

```ts
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const doc = new Y.Doc();
const provider = new WebsocketProvider(
  "ws://localhost:8788",
  "my-room", // room name — clients in the same room sync
  doc,
);

provider.on("status", ({ status }) => {
  console.log(status); // "connected" | "disconnected" | "connecting"
});
```

**Note:** The workspace app package is named `app-yjs` so Bun does not confuse it with the `yjs` npm package.

## Auth (later)

The server accepts upgrades in `@y/websocket-server` — you can validate cookies or query params in the `upgrade` handler before calling `handleUpgrade`. Plan that when you add shared auth.
