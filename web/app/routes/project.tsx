import type { CSSProperties } from "react";
import { Link } from "react-router";
import { Button } from "~/components/Button";
import { ArrowUpRight, ChevronLeftIcon, ChevronRight, GitHubIcon } from "~/components/Icons";
import { Picture } from "~/components/Picture";
import { ProjectArt } from "~/components/ProjectArt";
import { Reveal } from "~/components/Reveal";
import { StatusDot } from "~/components/StatusDot";
import { media } from "~/content/media";
import { SITE_URL, profile } from "~/content/profile";
import { findProject, projects } from "~/content/projects";
import { getDict, langFromPath, paths, useI18n } from "~/i18n";
import { seo } from "~/lib/seo";
import NotFound from "./not-found";
import styles from "./project.module.css";
import type { Route } from "./+types/project";

export const meta: Route.MetaFunction = ({ params, location }) => {
  const lang = langFromPath(location.pathname);
  const project = findProject(params.slug);
  const t = getDict(lang);
  if (!project) return [{ title: t.notFound.title }, { name: "robots", content: "noindex" }];
  const copy = project.copy[lang];
  const path = paths[lang].project(project.slug);
  return seo({
    lang,
    title: `${project.name} — ${copy.tagline} · ${profile.name}`,
    description: copy.summary,
    path,
    image: `/og/${project.slug}.png`,
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.name,
      headline: copy.tagline,
      description: copy.summary,
      url: SITE_URL + path,
      author: { "@type": "Person", name: profile.name, url: SITE_URL },
      keywords: project.stack.join(", "),
      ...(project.url ? { sameAs: project.url } : {}),
    },
  });
};

export default function ProjectPage({ params }: Route.ComponentProps) {
  const { lang, t, paths: p } = useI18n();
  const project = findProject(params.slug);
  if (!project) return <NotFound />;

  const copy = project.copy[lang];
  const assets = media[project.slug];
  const idx = projects.indexOf(project);
  const next = projects[(idx + 1) % projects.length]!;

  return (
    <main id="main" style={{ "--a1": project.accent, "--a2": project.accent2 } as CSSProperties}>
      <section className={styles.hero} aria-labelledby="project-title">
        <div className="container">
          <Link to={p.section("projects")} className={styles.back}>
            <ChevronLeftIcon /> {t.project.back}
          </Link>
          <p className={`t-eyebrow ${styles.eyebrow}`}>
            {t.kind[project.kind]} · {project.year}
          </p>
          <h1 id="project-title" className="t-hero">
            {project.name}
          </h1>
          <p className={`t-headline t-balance ${styles.tagline}`}>{copy.tagline}</p>
          <div className={styles.status}>
            <StatusDot project={project} />
          </div>
          <div className={styles.ctas}>
            {project.url && (
              <Button href={project.url} external size="lg">
                {t.project.visit} {project.name.split(" ")[0]} <ArrowUpRight />
              </Button>
            )}
            {project.repo && (
              <Button href={project.repo} external variant="secondary" size="lg">
                <GitHubIcon /> {t.project.code}
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="container-wide">
        <Reveal className={styles.visual}>
          {assets?.hero ? (
            <Picture
              asset={assets.hero}
              sizes="(min-width: 1244px) 1200px, 94vw"
              priority
              className={styles.img}
            />
          ) : (
            <ProjectArt project={project} size="hero" />
          )}
        </Reveal>
      </div>

      <section className="section" aria-label={lang === "fr" ? "Présentation" : "Overview"}>
        <div className="container">
          <Reveal>
            <p className={`${styles.summary} t-pretty`}>{copy.summary}</p>
          </Reveal>

          {project.metrics.length > 0 && (
            <dl className={styles.metrics}>
              {project.metrics.map((m, i) => (
                <Reveal key={m.label.en} delay={i * 0.08} className={styles.metric}>
                  <dt>{m.label[lang]}</dt>
                  <dd>{m.value}</dd>
                </Reveal>
              ))}
            </dl>
          )}
        </div>
      </section>

      <section className="section surface-alt" aria-labelledby="built-title">
        <div className="container">
          <h2 id="built-title" className={`t-headline ${styles.h2}`}>
            {t.project.built}
          </h2>
          <ul className={styles.built} role="list">
            {copy.built.map((item, i) => (
              <Reveal as="li" key={item} delay={(i % 2) * 0.06} className={styles.builtItem}>
                <span className={styles.check} aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="14" height="14">
                    <path
                      d="m3.5 8.5 3 3 6-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {item}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {copy.challenges.length > 0 && (
        <section className="section surface-dark" aria-labelledby="challenges-title">
          <div className="container">
            <h2 id="challenges-title" className={`t-headline ${styles.h2}`}>
              {t.project.challenges}
            </h2>
            <div className={styles.challenges}>
              {copy.challenges.map((c, i) => (
                <Reveal key={c.title} delay={i * 0.08} className={styles.challenge}>
                  <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="t-subtitle">{c.title}</h3>
                  <p className="t-secondary t-pretty">{c.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {assets?.gallery && assets.gallery.length > 0 && (
        <section className="section" aria-label={lang === "fr" ? "Galerie" : "Gallery"}>
          <div className={`container-wide ${styles.gallery}`}>
            {assets.gallery.map((a) => (
              <Reveal key={a.base}>
                <Picture asset={a} sizes="(min-width: 1244px) 600px, 94vw" className={styles.img} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="stack-title">
        <div className="container">
          <div className={styles.facts}>
            <div>
              <h2 id="stack-title" className={styles.factTitle}>
                {t.project.stack}
              </h2>
              <ul className={styles.stack} role="list">
                {project.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <dl className={styles.factList}>
              <div>
                <dt>{t.project.year}</dt>
                <dd>{project.year}</dd>
              </div>
              <div>
                <dt>{t.project.kind}</dt>
                <dd>{t.kind[project.kind]}</dd>
              </div>
              <div>
                <dt>{t.project.code}</dt>
                <dd>
                  {project.repo ? (
                    <a href={project.repo} target="_blank" rel="noopener">
                      GitHub <ArrowUpRight />
                    </a>
                  ) : (
                    t.project.privateRepo
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <nav className={styles.nextWrap} aria-label={t.project.next}>
        <Link
          to={p.project(next.slug)}
          className={styles.next}
          style={{ "--a1": next.accent, "--a2": next.accent2 } as CSSProperties}
          prefetch="intent"
        >
          <span className="t-eyebrow">{t.project.next}</span>
          <span className="t-headline">{next.name}</span>
          <span className={styles.nextTagline}>
            {next.copy[lang].tagline} <ChevronRight />
          </span>
        </Link>
      </nav>
    </main>
  );
}
