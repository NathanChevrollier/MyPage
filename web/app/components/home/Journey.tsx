import { ChevronLink } from "~/components/ChevronLink";
import { Reveal } from "~/components/Reveal";
import { SectionHeader } from "~/components/SectionHeader";
import { timeline } from "~/content/profile";
import { useI18n } from "~/i18n";
import styles from "./Journey.module.css";

export function Journey() {
  const { lang, t } = useI18n();
  return (
    <section id="journey" className="section surface-alt" aria-labelledby="journey-title">
      <div className="container">
        <SectionHeader id="journey-title" eyebrow={t.journey.eyebrow} title={t.journey.title} />
        <ol className={styles.list} role="list">
          {timeline.map((e, i) => (
            <Reveal as="li" key={e.title.en} delay={Math.min(i, 4) * 0.05} className={styles.item}>
              <p className={styles.period} data-kind={e.kind}>
                {e.period[lang]}
              </p>
              <div className={styles.card} data-kind={e.kind}>
                <p className={styles.kind}>
                  {e.kind === "now"
                    ? t.journey.now
                    : e.kind === "work"
                      ? t.journey.work
                      : t.journey.school}
                </p>
                <h3 className={styles.title}>{e.title[lang]}</h3>
                <p className={styles.place}>{e.place}</p>
                <p className={`t-secondary t-pretty ${styles.body}`}>{e.body[lang]}</p>
                {e.link && (
                  <p className={styles.link}>
                    <ChevronLink to={e.link.href} external>
                      {e.link.label[lang]}
                    </ChevronLink>
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
