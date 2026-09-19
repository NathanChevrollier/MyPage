export interface Site {
  slug: string;
  url: string;
}

export interface SiteStatus {
  up: boolean;
  /** Response time of the last successful probe, in ms. */
  ms: number | null;
  checkedAt: string;
}

export interface StatusPayload {
  generatedAt: string;
  sites: Record<string, SiteStatus>;
}

export interface ProbeResult {
  ok: boolean;
  ms: number | null;
}

type Fetch = typeof fetch;

/**
 * One HTTP probe. Redirects count as healthy (an app redirecting to its login
 * page is up); 4xx/5xx, timeouts and network errors do not.
 */
export async function probe(
  url: string,
  timeoutMs: number,
  fetchImpl: Fetch = fetch,
): Promise<ProbeResult> {
  const started = performance.now();
  try {
    const res = await fetchImpl(url, {
      method: "GET",
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
      headers: { "user-agent": "chevrolliernathan.fr status probe" },
    });
    // Free the socket; we only care about the status line.
    await res.body?.cancel();
    const ms = Math.round(performance.now() - started);
    return { ok: res.status < 400, ms };
  } catch {
    return { ok: false, ms: null };
  }
}

/**
 * Keeps per-site state and only reports a site as down after `failuresToDown`
 * consecutive failed probes, so a single blip never shows up publicly.
 */
export class StatusBoard {
  private readonly failures = new Map<string, number>();
  private readonly state = new Map<string, SiteStatus>();

  constructor(
    private readonly sites: Site[],
    private readonly failuresToDown = 2,
  ) {}

  record(slug: string, result: ProbeResult, now = new Date()): void {
    const previous = this.state.get(slug);
    const failures = result.ok ? 0 : (this.failures.get(slug) ?? 0) + 1;
    this.failures.set(slug, failures);
    const up = result.ok || (failures < this.failuresToDown && (previous?.up ?? true));
    this.state.set(slug, {
      up,
      ms: result.ok ? result.ms : null,
      checkedAt: now.toISOString(),
    });
  }

  async refresh(timeoutMs: number, fetchImpl: Fetch = fetch): Promise<void> {
    await Promise.all(
      this.sites.map(async (s) => this.record(s.slug, await probe(s.url, timeoutMs, fetchImpl))),
    );
  }

  snapshot(now = new Date()): StatusPayload {
    return { generatedAt: now.toISOString(), sites: Object.fromEntries(this.state) };
  }
}
