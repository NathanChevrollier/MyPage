import { describe, expect, it } from "vitest";
import { StatusBoard, probe } from "./probe.js";

const respond = (status: number) =>
  (async () => new Response(null, { status })) as unknown as typeof fetch;
const fail = (async () => {
  throw new TypeError("network down");
}) as unknown as typeof fetch;

describe("probe", () => {
  it("treats 2xx and redirects as up", async () => {
    expect((await probe("https://x.test", 1000, respond(200))).ok).toBe(true);
    expect((await probe("https://x.test", 1000, respond(307))).ok).toBe(true);
  });

  it("treats 4xx/5xx and network errors as down", async () => {
    expect((await probe("https://x.test", 1000, respond(404))).ok).toBe(false);
    expect((await probe("https://x.test", 1000, respond(502))).ok).toBe(false);
    expect(await probe("https://x.test", 1000, fail)).toEqual({ ok: false, ms: null });
  });

  it("reports a latency for successful probes", async () => {
    const { ms } = await probe("https://x.test", 1000, respond(200));
    expect(ms).toBeTypeOf("number");
  });
});

describe("StatusBoard", () => {
  const sites = [{ slug: "a", url: "https://a.test" }];

  it("does not flag a site down after a single failure", () => {
    const board = new StatusBoard(sites, 2);
    board.record("a", { ok: true, ms: 50 });
    board.record("a", { ok: false, ms: null });
    expect(board.snapshot().sites.a?.up).toBe(true);
    board.record("a", { ok: false, ms: null });
    expect(board.snapshot().sites.a?.up).toBe(false);
  });

  it("recovers on the first success", () => {
    const board = new StatusBoard(sites, 2);
    board.record("a", { ok: false, ms: null });
    board.record("a", { ok: false, ms: null });
    board.record("a", { ok: true, ms: 80 });
    expect(board.snapshot().sites.a).toMatchObject({ up: true, ms: 80 });
  });

  it("refreshes every site", async () => {
    const board = new StatusBoard(sites);
    await board.refresh(1000, respond(200));
    expect(Object.keys(board.snapshot().sites)).toEqual(["a"]);
  });
});
