import { Reveal } from "~/components/Reveal";
import { SectionHeader } from "~/components/SectionHeader";
import { skills } from "~/content/profile";
import { useI18n } from "~/i18n";
import styles from "./Skills.module.css";

/** Laid out like an Apple tech-specs table: label column, values column, hairlines. */
export function Skills() {
  const { lang, t } = useI18n();
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeader
          id="skills-title"
          eyebrow={t.skills.eyebrow}
          title={t.skills.title}
          lead={t.skills.lead}
        />
        <dl className={styles.specs}>
          {skills.map((g, i) => (
            <Reveal key={g.title.en} delay={i * 0.04} className={styles.row}>
              <dt className={styles.label}>{g.title[lang]}</dt>
              <dd className={styles.values}>
                <ul role="list">
                  {(Array.isArray(g.items) ? g.items : g.items[lang]).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
