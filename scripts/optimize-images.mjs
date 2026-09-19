// Turns media-src/ sources into responsive AVIF + WebP in web/public/media/,
// and writes web/app/content/media.json (dimensions included, so no layout shift).
//
// Usage: node scripts/optimize-images.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { basename, extname } from "node:path";
import sharp from "sharp";
import config from "./media.config.mjs";

const WIDTHS = [640, 1280, 2560];
const OUT = "web/public/media";
const manifest = {};

async function build(slug, entry) {
  const src = `media-src/${slug}/${entry.src}`;
  const name = basename(entry.src, extname(entry.src));
  const dir = `${OUT}/${slug}`;
  mkdirSync(dir, { recursive: true });
  const meta = await sharp(src).metadata();
  const width = meta.width;
  const height = meta.height;
  // Never upscale. The 1280 variant always exists: it is the <img> fallback src.
  const targets = WIDTHS.filter((w) => w <= width);
  if (!targets.includes(1280)) targets.push(1280);
  for (const w of targets) {
    const img = sharp(src).resize({ width: Math.min(w, width), withoutEnlargement: true });
    await img.clone().avif({ quality: 58, effort: 6 }).toFile(`${dir}/${name}-${w}.avif`);
    await img.clone().webp({ quality: 80, effort: 6 }).toFile(`${dir}/${name}-${w}.webp`);
  }
  console.log(`${slug}/${name} ${width}x${height} -> ${targets.join(", ")}`);
  return { base: `/media/${slug}/${name}`, width, height, alt: entry.alt };
}

for (const [slug, cfg] of Object.entries(config)) {
  manifest[slug] = {};
  if (cfg.hero) manifest[slug].hero = await build(slug, cfg.hero);
  if (cfg.gallery)
    manifest[slug].gallery = await Promise.all(cfg.gallery.map((g) => build(slug, g)));
}

writeFileSync("web/app/content/media.json", JSON.stringify(manifest, null, 2) + "\n");
console.log("wrote web/app/content/media.json");
