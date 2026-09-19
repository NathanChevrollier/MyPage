import type { MetaDescriptor } from "react-router";
import { SITE_URL, profile } from "~/content/profile";
import type { Lang } from "~/content/types";

interface SeoInput {
  lang: Lang;
  title: string;
  description: string;
  /** Path of the page in its own language, e.g. "/projets/scanlib". */
  path: string;
  /** Absolute or root-relative OG image path. */
  image?: string;
  type?: "website" | "article" | "profile";
  jsonLd?: Record<string, unknown>;
}

const DEFAULT_OG = "/og/default.png";

export function seo({
  lang,
  title,
  description,
  path,
  image,
  type = "website",
  jsonLd,
}: SeoInput): MetaDescriptor[] {
  const url = SITE_URL + (path === "/" ? "/" : path);
  const img = (image ?? DEFAULT_OG).startsWith("http") ? image! : SITE_URL + (image ?? DEFAULT_OG);
  const tags: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: type },
    { property: "og:site_name", content: profile.name },
    { property: "og:locale", content: lang === "fr" ? "fr_FR" : "en_US" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: img },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: img },
  ];
  if (jsonLd) tags.push({ "script:ld+json": jsonLd });
  return tags;
}

export const personJsonLd = (lang: Lang) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: SITE_URL,
  jobTitle: lang === "fr" ? "Développeur full-stack" : "Full-stack developer",
  address: { "@type": "PostalAddress", addressLocality: profile.city, addressCountry: "FR" },
  sameAs: [profile.github, profile.linkedin].filter(Boolean),
});
