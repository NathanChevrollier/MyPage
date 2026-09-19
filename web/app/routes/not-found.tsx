import { Button } from "~/components/Button";
import { getDict, langFromPath, useI18n } from "~/i18n";
import styles from "./not-found.module.css";
import type { Route } from "./+types/not-found";

export const meta: Route.MetaFunction = ({ location }) => {
  const t = getDict(langFromPath(location.pathname));
  return [
    { title: `${t.notFound.title} · Nathan Chevrollier` },
    { name: "robots", content: "noindex" },
  ];
};

export default function NotFound() {
  const { t, paths } = useI18n();
  return (
    <main id="main" className={styles.page}>
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <h1 className="t-headline t-balance">{t.notFound.title}</h1>
      <p className="t-intro t-secondary">{t.notFound.lead}</p>
      <div className={styles.cta}>
        <Button to={paths.home}>{t.notFound.back}</Button>
      </div>
    </main>
  );
}
