import { Button } from "~/components/Button";
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from "~/components/Icons";
import { Reveal } from "~/components/Reveal";
import { profile } from "~/content/profile";
import { useI18n } from "~/i18n";
import { useHydrated } from "~/lib/hydrated";
import styles from "./Contact.module.css";

export function Contact() {
  const { t } = useI18n();
  // Built after hydration so the address never sits in the prerendered HTML.
  const mailto = useHydrated() ? `mailto:${profile.email.user}@${profile.email.domain}` : undefined;

  return (
    <section
      id="contact"
      className={`section surface-dark ${styles.contact}`}
      aria-labelledby="contact-title"
    >
      <div className="container">
        <Reveal className={styles.inner}>
          <p className={`t-eyebrow t-secondary ${styles.eyebrow}`}>{t.contact.eyebrow}</p>
          <h2 id="contact-title" className={`t-hero t-balance ${styles.title}`}>
            <span className="t-gradient">{t.contact.title}</span>
          </h2>
          <p className={`t-intro t-secondary t-pretty ${styles.lead}`}>{t.contact.lead}</p>
          <div className={styles.actions}>
            <Button href={mailto ?? "#contact"} size="lg">
              <MailIcon /> {t.contact.email}
            </Button>
            <Button href={profile.github} external variant="secondary" size="lg">
              <GitHubIcon /> {t.contact.github}
            </Button>
            {profile.linkedin && (
              <Button href={profile.linkedin} external variant="secondary" size="lg">
                <LinkedInIcon /> {t.contact.linkedin}
              </Button>
            )}
            {profile.cv && (
              <Button href={`/cv/${profile.cv}`} download variant="secondary" size="lg">
                <DownloadIcon /> {t.contact.cv}
              </Button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
