import { type CSSProperties, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { alternatePath, useI18n } from "~/i18n";
import styles from "./GlobalNav.module.css";

const SECTIONS = ["projects", "journey", "skills", "contact"] as const;

export function GlobalNav() {
  const { lang, t, paths } = useI18n();
  const { pathname, hash } = useLocation();
  // The menu belongs to the URL it was opened on: navigating closes it with no effect needed.
  const here = pathname + hash;
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === here;
  const setOpen = (next: boolean) => setOpenedAt(next ? here : null);
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Switch to the dark variant while the bar sits over a dark section, like apple.com.
  useEffect(() => {
    const darks = document.querySelectorAll(".surface-dark");
    if (!darks.length) return;
    const inBand = new Set<Element>();
    const nav =
      parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 48;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inBand.add(e.target);
          else inBand.delete(e.target);
        }
        setOverDark(inBand.size > 0);
      },
      { rootMargin: `0px 0px -${window.innerHeight - nav}px 0px` },
    );
    darks.forEach((d) => io.observe(d));
    return () => {
      io.disconnect();
      setOverDark(false);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenedAt(null);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const other = lang === "fr" ? "en" : "fr";
  const labels = {
    projects: t.nav.projects,
    journey: t.nav.journey,
    skills: t.nav.skills,
    contact: t.nav.contact,
  };

  return (
    <header className={styles.nav} data-open={open} data-scrolled={scrolled} data-dark={overDark}>
      <nav
        className={styles.inner}
        aria-label={lang === "fr" ? "Navigation principale" : "Main navigation"}
      >
        <Link to={paths.home} className={styles.brand} aria-label={t.nav.home}>
          <span className={styles.mark} aria-hidden="true">
            N
          </span>
          <span className={styles.brandText}>Nathan Chevrollier</span>
        </Link>

        <ul className={styles.links} role="list" id="global-nav-links">
          {SECTIONS.map((id, i) => (
            <li key={id} style={{ "--i": i } as CSSProperties}>
              <Link to={paths.section(id)} className={styles.link}>
                {labels[id]}
              </Link>
            </li>
          ))}
          <li style={{ "--i": SECTIONS.length } as CSSProperties} className={styles.langItem}>
            <Link
              to={alternatePath(pathname, other)}
              className={styles.lang}
              hrefLang={other}
              lang={other}
              aria-label={t.nav.switchLang}
            >
              {t.nav.switchLangShort}
            </Link>
          </li>
        </ul>

        <button
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls="global-nav-links"
          aria-label={open ? t.nav.close : t.nav.menu}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
      </nav>
    </header>
  );
}
