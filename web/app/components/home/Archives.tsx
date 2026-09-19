import { ChevronLink } from "~/components/ChevronLink";
import { Reveal } from "~/components/Reveal";
import { SectionHeader } from "~/components/SectionHeader";
import { byTier } from "~/content/projects";
import { useI18n } from "~/i18n";
import styles from "./Archives.module.css";

/** Compact list of coursework: present, but never competing with the products. */
export function Archives() {
  const { lang, t, paths } = useI18n();
  const items = byTier("archive");
  if (!items.length) return null;
  return (
    <section className={`section ${styles.archives}`} aria-labelledby="archives-title">
      <div className="container">
        <SectionHeader
          id="archives-title"
          eyebrow={t.archive.eyebrow}
          title={t.archive.title}
          lead={t.archive.lead}
          align="start"
        />
        <ul className={styles.list} role="list">
          {items.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 0.05} className={styles.row}>
              <div className={styles.main}>
                <h3 className={styles.name}>
                  {p.name}
                  <span className={styles.year}>{p.year}</span>
                </h3>
                <p className="t-secondary">{p.copy[lang].tagline}</p>
                <p className={styles.stack}>{p.stack.join(" · ")}</p>
              </div>
              <div className={styles.links}>
                {p.url && (
                  <ChevronLink to={p.url} external aria-label={`${t.project.visit} ${p.name}`}>
                    {t.project.visit}
                  </ChevronLink>
                )}
                <ChevronLink
                  to={paths.project(p.slug)}
                  aria-label={`${t.project.learnMore} : ${p.name}`}
                >
                  {t.project.learnMore}
                </ChevronLink>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
