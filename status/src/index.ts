import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { StatusBoard, type Site } from "./probe.js";

const PORT = Number(process.env.PORT ?? 3101);
const INTERVAL_MS = Number(process.env.PROBE_INTERVAL_MS ?? 60_000);
const TIMEOUT_MS = Number(process.env.PROBE_TIMEOUT_MS ?? 8_000);
const SITES_FILE =
  process.env.SITES_FILE ?? fileURLToPath(new URL("../../content/sites.json", import.meta.url));

const { sites } = JSON.parse(readFileSync(SITES_FILE, "utf8")) as { sites: Site[] };
const board = new StatusBoard(sites);

const app = new Hono();

app.get("/api/status", (c) => {
  c.header("cache-control", "public, max-age=30");
  return c.json(board.snapshot());
});

app.get("/healthz", (c) => c.text("ok"));

app.notFound((c) => c.json({ error: "not found" }, 404));

async function loop() {
  await board.refresh(TIMEOUT_MS);
  setTimeout(loop, INTERVAL_MS).unref();
}

void loop();

const server = serve({ fetch: app.fetch, port: PORT, hostname: "0.0.0.0" }, (info) => {
  console.log(
    `status service listening on :${info.port}, probing ${sites.length} sites every ${INTERVAL_MS / 1000}s`,
  );
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
