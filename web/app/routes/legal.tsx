import { profile } from "~/content/profile";
import { getDict, langFromPath, paths, useI18n } from "~/i18n";
import { useHydrated } from "~/lib/hydrated";
import { seo } from "~/lib/seo";
import styles from "./legal.module.css";
import type { Route } from "./+types/legal";

export const meta: Route.MetaFunction = ({ location }) => {
  const lang = langFromPath(location.pathname);
  const t = getDict(lang);
  return seo({
    lang,
    title: `${t.legal.title} · ${profile.name}`,
    description:
      lang === "fr"
        ? "Mentions légales et données personnelles."
        : "Legal notice and personal data.",
    path: paths[lang].legal,
  });
};

const HOST = "OVH SAS — 2 rue Kellermann, 59100 Roubaix, France — ovhcloud.com";

export default function Legal() {
  const { lang, t } = useI18n();
  const email = useHydrated() ? `${profile.email.user}@${profile.email.domain}` : undefined;
  const mail = email ? <a href={`mailto:${email}`}>{email}</a> : "…";

  return (
    <main id="main" className={`container ${styles.page}`}>
      <h1 className="t-headline">{t.legal.title}</h1>
      {lang === "fr" ? (
        <>
          <section>
            <h2>Éditeur</h2>
            <p>
              Ce site est édité à titre personnel et non professionnel par {profile.name},{" "}
              {profile.city}, France. Contact : {mail}.
            </p>
            <p>Directeur de la publication : {profile.name}.</p>
          </section>
          <section>
            <h2>Hébergement</h2>
            <p>{HOST}. Serveur situé au Royaume-Uni.</p>
          </section>
          <section>
            <h2>Données personnelles</h2>
            <p>
              Ce site ne dépose aucun cookie, n'utilise aucun outil de mesure d'audience ni de
              traceur tiers, et ne collecte aucune donnée via formulaire. Comme tout serveur web, il
              enregistre des journaux techniques (adresse IP, date, page demandée, navigateur) à des
              fins de sécurité ; ils sont conservés au maximum 14 jours.
            </p>
            <p>
              Conformément au RGPD, vous pouvez demander l'accès ou la suppression de données vous
              concernant en écrivant à l'adresse ci-dessus.
            </p>
          </section>
          <section>
            <h2>Propriété intellectuelle</h2>
            <p>
              Les textes, visuels et le code de ce site sont la propriété de {profile.name}, sauf
              mention contraire. Les marques et logos des technologies citées appartiennent à leurs
              détenteurs respectifs.
            </p>
          </section>
        </>
      ) : (
        <>
          <section>
            <h2>Publisher</h2>
            <p>
              This site is published in a personal, non-commercial capacity by {profile.name},{" "}
              {profile.city}, France. Contact: {mail}.
            </p>
          </section>
          <section>
            <h2>Hosting</h2>
            <p>{HOST}. Server located in the United Kingdom.</p>
          </section>
          <section>
            <h2>Personal data</h2>
            <p>
              This site sets no cookies, uses no analytics or third-party trackers, and collects no
              data through forms. Like any web server, it keeps technical logs (IP address, date,
              requested page, browser) for security purposes, for at most 14 days.
            </p>
            <p>
              Under the GDPR, you can request access to or deletion of data about you by writing to
              the address above.
            </p>
          </section>
          <section>
            <h2>Intellectual property</h2>
            <p>
              Texts, visuals and code on this site belong to {profile.name} unless stated otherwise.
              Trademarks and logos of the technologies mentioned belong to their respective owners.
            </p>
          </section>
        </>
      )}
    </main>
  );
}
