import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { alternatePath, langFromPath, paths } from "~/i18n";
import { projects } from "./projects";

const sitesFile = JSON.parse(
  readFileSync(new URL("../../../content/sites.json", import.meta.url), "utf8"),
) as { sites: { slug: string; url: string }[] };

describe("projects", () => {
  it("have unique, URL-safe slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("have complete copy in both languages", () => {
    for (const p of projects) {
      for (const lang of ["fr", "en"] as const) {
        const c = p.copy[lang];
        expect(c.tagline, `${p.slug} ${lang} tagline`).not.toBe("");
        expect(c.summary, `${p.slug} ${lang} summary`).not.toBe("");
        expect(c.built.length, `${p.slug} ${lang} built`).toBeGreaterThan(0);
      }
      expect(p.copy.fr.built.length, `${p.slug} built fr/en parity`).toBe(p.copy.en.built.length);
      expect(p.copy.fr.challenges.length, `${p.slug} challenges fr/en parity`).toBe(
        p.copy.en.challenges.length,
      );
    }
  });

  it("use https links only", () => {
    for (const p of projects) {
      if (p.url) expect(p.url).toMatch(/^https:\/\//);
      if (p.repo) expect(p.repo).toMatch(/^https:\/\/github\.com\//);
    }
  });

  it("keep the status service's site list in sync", () => {
    const expected = projects
      .filter((p) => p.status === "live" && p.url)
      .map((p) => ({ slug: p.slug, url: p.url }))
      .sort((a, b) => a.slug.localeCompare(b.slug));
    const actual = [...sitesFile.sites].sort((a, b) => a.slug.localeCompare(b.slug));
    expect(actual).toEqual(expected);
  });
});

describe("i18n routing", () => {
  it("detects the language from the path", () => {
    expect(langFromPath("/")).toBe("fr");
    expect(langFromPath("/projets/scanlib")).toBe("fr");
    expect(langFromPath("/en")).toBe("en");
    expect(langFromPath("/en/projects/scanlib")).toBe("en");
    expect(langFromPath("/english-page")).toBe("fr");
  });

  it("maps every page to its translation", () => {
    expect(alternatePath("/", "en")).toBe("/en");
    expect(alternatePath("/en", "fr")).toBe("/");
    expect(alternatePath("/projets/scanlib", "en")).toBe(paths.en.project("scanlib"));
    expect(alternatePath("/en/projects/scanlib/", "fr")).toBe(paths.fr.project("scanlib"));
    expect(alternatePath("/mentions-legales", "en")).toBe("/en/legal");
    expect(alternatePath("/unknown", "en")).toBe("/en");
  });
});
