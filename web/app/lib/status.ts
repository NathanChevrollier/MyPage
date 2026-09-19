import { useSyncExternalStore } from "react";

/** Contract shared with the status service (status/src/types.ts). */
export interface SiteStatus {
  up: boolean;
  ms: number | null;
  checkedAt: string;
}

export interface StatusPayload {
  generatedAt: string;
  sites: Record<string, SiteStatus>;
}

type State =
  { kind: "idle" | "loading" } | { kind: "ready"; data: StatusPayload } | { kind: "error" };

const REFRESH_MS = 60_000;

let state: State = { kind: "idle" };
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function set(next: State) {
  state = next;
  listeners.forEach((l) => l());
}

async function load() {
  if (state.kind === "idle") set({ kind: "loading" });
  try {
    const res = await fetch("/api/status", { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(String(res.status));
    set({ kind: "ready", data: (await res.json()) as StatusPayload });
  } catch {
    // Keep the last good data if a refresh fails; only report an error with nothing to show.
    if (state.kind !== "ready") set({ kind: "error" });
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    void load();
    timer = setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, REFRESH_MS);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const serverState: State = { kind: "idle" };

/** Live status of every probed site; one shared request for the whole page. */
export function useSiteStatus(): State {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => serverState,
  );
}
