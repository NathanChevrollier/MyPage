export type Lang = "fr" | "en";
export type Localized<T> = Record<Lang, T>;

export type ProjectTier = "flagship" | "lab" | "archive";
export type ProjectStatus = "live" | "available" | "soon" | "wip" | "shipped";
export type ProjectKind = "web" | "desktop" | "mobile" | "game-mod";

export interface Metric {
  value: string;
  label: Localized<string>;
}

export interface ProjectCopy {
  /** One punchy line, Apple-style headline. */
  tagline: string;
  /** Two or three sentences: what it is, for whom. */
  summary: string;
  /** Concrete things built — shown as the "What I did" list. */
  built: string[];
  /** The hard parts and how they were solved. */
  challenges: { title: string; body: string }[];
}

export interface Project {
  slug: string;
  name: string;
  tier: ProjectTier;
  status: ProjectStatus;
  kind: ProjectKind;
  /** Public URL when deployed. Sites listed here are probed by the status service. */
  url?: string;
  /** Download page for installable software (desktop apps). */
  download?: string;
  /** Only public repositories. */
  repo?: string;
  year: string;
  stack: string[];
  /** App icon, taken from the project itself (served from /logos). Falls back to initials. */
  logo?: string;
  /** Accent color used for the tile art and highlights. */
  accent: string;
  /** Secondary color for gradients. */
  accent2: string;
  metrics: Metric[];
  copy: Localized<ProjectCopy>;
}
