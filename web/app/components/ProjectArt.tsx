import type { CSSProperties } from "react";
import type { Project } from "~/content/types";
import styles from "./ProjectArt.module.css";

interface Props {
  project: Project;
  size?: "tile" | "hero" | "card";
  className?: string;
}

/**
 * Generated artwork for a project: a soft mesh gradient in its brand colours with
 * its initials. Used as a placeholder until real renders exist, and on purpose for
 * projects without screenshots.
 */
export function ProjectArt({ project, size = "tile", className }: Props) {
  const initials = project.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  return (
    <div
      className={[styles.art, styles[size], className].filter(Boolean).join(" ")}
      style={{ "--a1": project.accent, "--a2": project.accent2 } as CSSProperties}
      aria-hidden="true"
    >
      <div className={styles.glow} />
      <div className={styles.orb} />
      <span className={styles.mono}>{initials}</span>
    </div>
  );
}
