// Captures the live sites into media-src/<slug>/ (raw PNG, 2x DPR).
// Those raw captures are then composed (Blender) and optimised (optimize-images.mjs).
//
// Usage: node scripts/screenshots.mjs [slug...]

import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const targets = [
  { slug: "scanlib", url: "https://scanlib.chevrolliernathan.fr" },
  { slug: "algocluck", url: "https://algocluck.chevrolliernathan.fr" },
  { slug: "cinemap", url: "https://cinemap.chevrolliernathan.fr" },
  { slug: "nexus-dashboard", url: "https://nexus.chevrolliernathan.fr" },
];

const viewports = [
  { name: "desktop", width: 1440, height: 900, isMobile: false },
  { name: "mobile", width: 390, height: 844, isMobile: true },
];

const only = process.argv.slice(2);
const browser = await chromium.launch();

for (const t of targets.filter((t) => !only.length || only.includes(t.slug))) {
  const dir = `media-src/${t.slug}`;
  mkdirSync(dir, { recursive: true });
  for (const vp of viewports) {
    for (const scheme of ["dark", "light"]) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
        isMobile: vp.isMobile,
        colorScheme: scheme,
        locale: "fr-FR",
      });
      const page = await ctx.newPage();
      await page.goto(t.url, { waitUntil: "networkidle", timeout: 30_000 });
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `${dir}/${vp.name}-${scheme}.png` });
      await ctx.close();
      console.log(`${t.slug} ${vp.name} ${scheme}`);
    }
  }
}

await browser.close();
