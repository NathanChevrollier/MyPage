import type { Project } from "~/content/types";
import { useI18n } from "~/i18n";
import { useSiteStatus } from "~/lib/status";
import styles from "./StatusDot.module.css";

/**
 * Live projects show real uptime from /api/status; others show their static status.
 * If the status service is unreachable, fall back to the static label instead of
 * claiming a site is down.
 */
export function StatusDot({ project }: { project: Project }) {
  const { t } = useI18n();
  const status = useSiteStatus();

  if (project.status !== "live" || !project.url) {
    return (
      <span className={styles.badge} data-tone={project.status}>
        {t.status[project.status]}
      </span>
    );
  }

  const site = status.kind === "ready" ? status.data.sites[project.slug] : undefined;
  const tone = site ? (site.up ? "up" : "down") : "pending";
  const label = site
    ? site.up
      ? t.status.up
      : t.status.down
    : status.kind === "error"
      ? t.status.live
      : t.status.checking;

  return (
    <span className={styles.live} data-tone={tone} role="status">
      <span className={styles.dot} aria-hidden="true" />
      {label}
      {site?.up && site.ms != null && (
        <span className={styles.ms}>
          · {site.ms} {t.status.latency}
        </span>
      )}
    </span>
  );
}
