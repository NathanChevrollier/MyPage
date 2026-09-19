import "@fontsource-variable/inter/wght.css";
import "./styles/global.css";
import interLatin from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";

import type { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "react-router";
import { Footer } from "~/components/Footer";
import { GlobalNav } from "~/components/GlobalNav";
import { SITE_URL } from "~/content/profile";
import { alternatePath, langFromPath } from "~/i18n";
import { dicts } from "~/i18n/dict";
import NotFound from "./routes/not-found";

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  const frPath = alternatePath(pathname, "fr");
  const enPath = alternatePath(pathname, "en");

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="color-scheme" content="light dark" />
        <link rel="preload" href={interLatin} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="alternate" hrefLang="fr" href={SITE_URL + frPath} />
        <link rel="alternate" hrefLang="en" href={SITE_URL + enPath} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL + frPath} />
        <Meta />
        {/* Flags JS support before first paint so reveal animations never hide content without JS. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <Links />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {dicts[lang].nav.skip}
        </a>
        <GlobalNav />
        {children}
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return <NotFound />;
}
