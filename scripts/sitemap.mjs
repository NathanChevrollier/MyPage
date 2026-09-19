// Writes build/client/sitemap.xml from the prerendered pages, with FR/EN alternates.
// Run from web/ after `react-router build`.

import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const SITE = "https://chevrolliernathan.fr";
const root = "build/client";

const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (name === "index.html") pages.push("/" + relative(root, dir).replace(/\\/g, "/"));
  }
})(root);

const clean = pages
  .map((p) => (p === "/" ? "/" : p.replace(/\/$/, "")))
  .filter((p) => !/(^|\/)404$/.test(p))
  .sort();

// FR <-> EN path mapping, mirroring app/i18n alternatePath().
const toEn = (p) =>
  p === "/"
    ? "/en"
    : p === "/mentions-legales"
      ? "/en/legal"
      : p.replace(/^\/projets\//, "/en/projects/");
const fr = clean.filter((p) => !p.startsWith("/en"));

const urls = fr
  .map((p) => {
    const en = toEn(p);
    const alts = `
    <xhtml:link rel="alternate" hreflang="fr" href="${SITE}${p}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${p}"/>`;
    const priority = p === "/" ? "1.0" : p.startsWith("/projets/") ? "0.8" : "0.3";
    return [p, en]
      .map(
        (u) =>
          `  <url>\n    <loc>${SITE}${u === "/" ? "/" : u}</loc>${alts}\n    <priority>${priority}</priority>\n  </url>`,
      )
      .join("\n");
  })
  .join("\n");

writeFileSync(
  join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
);
console.log(`sitemap.xml: ${fr.length * 2} URLs`);
