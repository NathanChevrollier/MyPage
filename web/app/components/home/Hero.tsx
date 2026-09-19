import { useCallback, useRef } from "react";
import { Button } from "~/components/Button";
import { useI18n } from "~/i18n";
import { useScrollProgress } from "~/lib/scroll";
import { HeroStage } from "./HeroStage";
import styles from "./Hero.module.css";

export function Hero() {
  const { t, paths } = useI18n();
  const stageRef = useRef<HTMLDivElement>(null);
  // The device tilts up and grows as it scrolls into place, like a product reveal.
  // The same progress also drives the 3D lid, through a ref (no re-render).
  const progress = useRef(0);
  const onProgress = useCallback((p: number) => {
    progress.current = p;
  }, []);
  useScrollProgress(stageRef, 0.35, onProgress);

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.copy}`}>
        <p className={`t-eyebrow ${styles.eyebrow}`}>{t.hero.eyebrow}</p>
        <h1 id="hero-title" className={`t-hero t-balance ${styles.title}`}>
          <span className="t-gradient">{t.hero.title}</span>
        </h1>
        <p className={`t-headline t-balance ${styles.subtitle}`}>{t.hero.subtitle}</p>
        <p className={`t-intro t-secondary t-pretty ${styles.lead}`}>{t.hero.lead}</p>
        <div className={styles.ctas}>
          <Button to={paths.section("contact")} size="lg">
            {t.hero.ctaPrimary}
          </Button>
          <Button to={paths.section("projects")} variant="secondary" size="lg">
            {t.hero.ctaSecondary}
          </Button>
        </div>
      </div>

      <div ref={stageRef} className={styles.stageWrap}>
        <div className={styles.stage}>
          <HeroStage progress={progress} />
        </div>
      </div>
    </section>
  );
}
