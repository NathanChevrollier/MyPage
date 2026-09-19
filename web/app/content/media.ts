import generated from "./media.json";

/**
 * Optimised images produced by scripts/optimize-images.mjs into web/public/media,
 * listed in media.json (generated — edit scripts/media.config.mjs instead).
 * Each entry is a base path; <Picture> appends `-{width}.{avif|webp}`.
 * A project without an entry falls back to its generated <ProjectArt>.
 */
export interface MediaAsset {
  base: string;
  width: number;
  height: number;
  alt: { fr: string; en: string };
}

export const WIDTHS = [640, 1280, 2560] as const;

export const media: Record<string, { hero?: MediaAsset; gallery?: MediaAsset[] }> = generated;
