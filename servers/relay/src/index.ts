/**
 * Thin message relay for DIY CRDT demos (Actual-style).
 * Append-only log + merkle sync API — implement in packages/crdt-core.
 */

const port = Number(process.env.PORT ?? 8787);

const server = Bun.serve({
  port,
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/health") {
      return Response.json({ ok: true, service: "relay" });
    }

    return Response.json(
      {
        error: "Not implemented",
        hint: "POST /sync/messages, GET /sync/messages?since=…",
      },
      { status: 501 },
    );
  },
});

console.log(`relay listening on http://localhost:${server.port}`);
