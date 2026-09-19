import { Archives } from "~/components/home/Archives";
import { Contact } from "~/components/home/Contact";
import { FlagshipStory } from "~/components/home/FlagshipStory";
import { Hero } from "~/components/home/Hero";
import { Journey } from "~/components/home/Journey";
import { LabCarousel } from "~/components/home/LabCarousel";
import { LiveGrid } from "~/components/home/LiveGrid";
import { Skills } from "~/components/home/Skills";
import { byTier } from "~/content/projects";
import { langFromPath, paths } from "~/i18n";
import { getDict } from "~/i18n";
import { personJsonLd, seo } from "~/lib/seo";
import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = ({ location }) => {
  const lang = langFromPath(location.pathname);
  const t = getDict(lang);
  return seo({
    lang,
    title: t.meta.title,
    description: t.meta.description,
    path: paths[lang].home,
    type: "profile",
    jsonLd: personJsonLd(lang),
  });
};

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <LiveGrid />
      <div id="featured">
        {byTier("flagship").map((p, i) => (
          <FlagshipStory key={p.slug} project={p} index={i} />
        ))}
      </div>
      <LabCarousel />
      <Archives />
      <Journey />
      <Skills />
      <Contact />
    </main>
  );
}
