import { useLocation } from "react-router";
import type { Lang } from "~/content/types";
import { dicts, type Dict } from "./dict";

export type { Dict };

/** Localised URL builders. Route shapes are declared in app/routes.ts. */
export const paths = {
  fr: {
    home: "/",
    section: (id: string) => `/#${id}`,
    project: (slug: string) => `/projets/${slug}`,
    legal: "/mentions-legales",
  },
  en: {
    home: "/en",
    section: (id: string) => `/en#${id}`,
    project: (slug: string) => `/en/projects/${slug}`,
    legal: "/en/legal",
  },
} as const;

export const langFromPath = (pathname: string): Lang =>
  pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";

/** Same page in the other language — used by the language switch and hreflang. */
export function alternatePath(pathname: string, target: Lang): string {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const project = clean.match(/^(?:\/en\/projects|\/projets)\/([^/]+)$/);
  if (project) return paths[target].project(project[1]!);
  if (clean === "/mentions-legales" || clean === "/en/legal") return paths[target].legal;
  return paths[target].home;
}

export function useI18n() {
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  return { lang, t: dicts[lang], paths: paths[lang] };
}

export const getDict = (lang: Lang): Dict => dicts[lang];
