import { ChevronLink } from "~/components/ChevronLink";
import { Picture } from "~/components/Picture";
import { ProjectArt } from "~/components/ProjectArt";
import { Reveal } from "~/components/Reveal";
import { SectionHeader } from "~/components/SectionHeader";
import { StatusDot } from "~/components/StatusDot";
import { media } from "~/content/media";
import { projects } from "~/content/projects";
import { useI18n } from "~/i18n";
import styles from "./LiveGrid.module.css";

/** Every project reachable on a subdomain of the VPS — the site's "portal". */
export function LiveGrid() {
  const { lang, t, paths } = useI18n();
  // Products only; school projects live in <Archives>.
  const live = projects.filter((p) => p.status === "live" && p.url && p.tier !== "archive");

  return (
    <section id="projects" className="section surface-alt" aria-labelledby="live-title">
      <div className="container-wide">
        <SectionHeader
          id="live-title"
          eyebrow={t.live.eyebrow}
          title={t.live.title}
          lead={t.live.lead}
        />
        <ul className={styles.grid} role="list">
          {live.map((p, i) => {
            const copy = p.copy[lang];
            const hero = media[p.slug]?.hero;
            const featured = p.tier === "flagship";
            return (
              <Reveal
                as="li"
                key={p.slug}
                delay={i * 0.06}
                className={`${styles.tile} ${featured ? styles.featured : styles.compact}`}
              >
                <div className={styles.body}>
                  <div className={styles.meta}>
                    <StatusDot project={p} />
                  </div>
                  <h3 className={`t-title ${styles.name}`}>{p.name}</h3>
                  <p className={`${styles.tagline} t-balance`}>{copy.tagline}</p>
                  <p className={`t-caption t-secondary ${styles.host}`}>{new URL(p.url!).host}</p>
                  <div className={styles.links}>
                    <ChevronLink to={p.url!} external aria-label={`${t.project.visit} ${p.name}`}>
                      {t.project.visit}
                    </ChevronLink>
                    <ChevronLink
                      to={paths.project(p.slug)}
                      aria-label={`${t.project.learnMore} : ${p.name}`}
                    >
                      {t.project.learnMore}
                    </ChevronLink>
                  </div>
                </div>
                {featured && (
                  <div className={styles.visual}>
                    {hero ? (
                      <Picture
                        asset={hero}
                        sizes="(min-width: 1068px) 560px, 90vw"
                        className={styles.img}
                      />
                    ) : (
                      <ProjectArt project={p} className={styles.img} />
                    )}
                  </div>
                )}
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
