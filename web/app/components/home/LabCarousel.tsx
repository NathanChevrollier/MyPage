import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, ChevronRight } from "~/components/Icons";
import { ProjectArt } from "~/components/ProjectArt";
import { SectionHeader } from "~/components/SectionHeader";
import { StatusDot } from "~/components/StatusDot";
import { byTier } from "~/content/projects";
import { useI18n } from "~/i18n";
import styles from "./LabCarousel.module.css";

/** Apple's "Get to know…" horizontal gallery: native scroll + snap, with paddle buttons. */
export function LabCarousel() {
  const { lang, t, paths } = useI18n();
  const items = byTier("lab");
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft < 8,
      end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8,
    });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const step = card.getBoundingClientRect().width + 20;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="section" aria-labelledby="lab-title">
      <div className="container">
        <SectionHeader
          id="lab-title"
          eyebrow={t.lab.eyebrow}
          title={t.lab.title}
          lead={t.lab.lead}
          align="start"
        />
      </div>
      <ul ref={track} className={styles.track} role="list" onScroll={update}>
        {items.map((p) => (
          <li key={p.slug} className={styles.card}>
            <Link to={paths.project(p.slug)} className={styles.link} prefetch="intent">
              <ProjectArt project={p} size="card" className={styles.art} />
              <div className={styles.overlay}>
                <p className={styles.kind}>{t.kind[p.kind]}</p>
                <h3 className={styles.name}>{p.name}</h3>
                <p className={styles.tagline}>{p.copy[lang].tagline}</p>
              </div>
              <div className={styles.foot}>
                <StatusDot project={p} />
                <span className={styles.plus} aria-hidden="true">
                  +
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className={`container ${styles.paddles}`}>
        <button
          type="button"
          className={styles.paddle}
          onClick={() => page(-1)}
          disabled={edges.start}
          aria-label={t.lab.prev}
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          className={styles.paddle}
          onClick={() => page(1)}
          disabled={edges.end}
          aria-label={t.lab.next}
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}
