import { type CSSProperties, useRef } from "react";
import { ChevronLink } from "~/components/ChevronLink";
import { Picture } from "~/components/Picture";
import { ProjectArt } from "~/components/ProjectArt";
import { Reveal } from "~/components/Reveal";
import { StatusDot } from "~/components/StatusDot";
import { media } from "~/content/media";
import type { Project } from "~/content/types";
import { useI18n } from "~/i18n";
import { useScrollProgress } from "~/lib/scroll";
import styles from "./FlagshipStory.module.css";

interface Props {
  project: Project;
  index: number;
}

/**
 * Full-bleed dark chapter for a flagship project: headline, a visual that settles
 * into place as it scrolls, key numbers, then the two links.
 */
export function FlagshipStory({ project, index }: Props) {
  const { lang, t, paths } = useI18n();
  const copy = project.copy[lang];
  const hero = media[project.slug]?.hero;
  const visualRef = useRef<HTMLDivElement>(null);
  useScrollProgress(visualRef, 0.5);

  const titleId = `flagship-${project.slug}`;

  return (
    <section
      className={`surface-dark ${styles.story}`}
      aria-labelledby={titleId}
      style={{ "--a1": project.accent, "--a2": project.accent2 } as CSSProperties}
    >
      <div className="container">
        <Reveal as="header" className={styles.header}>
          <p className={`t-eyebrow ${styles.eyebrow}`}>
            {index === 0 ? `${t.flagship.eyebrow} · ` : ""}
            {project.name}
          </p>
          <h3 id={titleId} className="t-headline t-balance">
            {copy.tagline}
          </h3>
          <p className={`t-intro t-secondary t-pretty ${styles.summary}`}>{copy.summary}</p>
          <div className={styles.status}>
            <StatusDot project={project} />
          </div>
        </Reveal>
      </div>

      <div className="container-wide" ref={visualRef}>
        <div className={styles.visual}>
          <div className={styles.halo} aria-hidden="true" />
          {hero ? (
            <Picture asset={hero} sizes="(min-width: 1244px) 1200px, 94vw" className={styles.img} />
          ) : (
            <ProjectArt project={project} size="hero" className={styles.img} />
          )}
        </div>
      </div>

      <div className="container">
        {project.metrics.length > 0 && (
          <dl className={styles.metrics}>
            {project.metrics.map((metric, i) => (
              <Reveal key={metric.label.en} delay={i * 0.08} className={styles.metric}>
                <dt className={styles.metricLabel}>{metric.label[lang]}</dt>
                <dd className={styles.metricValue}>{metric.value}</dd>
              </Reveal>
            ))}
          </dl>
        )}

        <Reveal className={styles.footer}>
          <ul className={styles.stack} role="list" aria-label={t.project.stack}>
            {project.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className={styles.links}>
            {project.url && (
              <ChevronLink
                to={project.url}
                external
                aria-label={`${t.project.visit} ${project.name}`}
              >
                {t.project.visit}
              </ChevronLink>
            )}
            <ChevronLink
              to={paths.project(project.slug)}
              aria-label={`${t.project.learnMore} : ${project.name}`}
            >
              {t.project.learnMore}
            </ChevronLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
