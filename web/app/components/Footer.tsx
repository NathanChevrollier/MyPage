import { Link } from "react-router";
import { profile } from "~/content/profile";
import { useI18n } from "~/i18n";
import styles from "./Footer.module.css";

export function Footer() {
  const { t, paths } = useI18n();
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p className={styles.note}>{t.footer.madeWith}</p>
        <div className={styles.row}>
          <p>© 2026 {profile.name}</p>
          <ul className={styles.links} role="list">
            <li>
              <Link to={paths.legal}>{t.footer.legal}</Link>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noopener">
                GitHub
              </a>
            </li>
            {profile.linkedin && (
              <li>
                <a href={profile.linkedin} target="_blank" rel="noopener">
                  LinkedIn
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </footer>
  );
}
