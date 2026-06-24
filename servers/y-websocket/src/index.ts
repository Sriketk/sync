/**
 * Minimal WebSocket relay placeholder for Yjs demos.
 * Replace with y-websocket server or integrate lib0 broadcast.
 */

const port = Number(process.env.PORT ?? 8788);

const server = Bun.serve({
  port,
  fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === "/health") {
      return Response.json({ ok: true, service: "y-websocket" });
    }

    if (server.upgrade(req)) {
      return undefined;
    }

    return new Response("Yjs WebSocket relay — connect via ws://", { status: 200 });
  },
  websocket: {
    open(ws) {
      ws.subscribe("yjs");
    },
    message(ws, message) {
      ws.publish("yjs", message);
    },
  },
});

console.log(`y-websocket listening on ws://localhost:${server.port}`);
