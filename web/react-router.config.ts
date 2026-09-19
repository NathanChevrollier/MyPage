import type { Config } from "@react-router/dev/config";
import { projects } from "./app/content/projects";
import { paths } from "./app/i18n";

export default {
  ssr: false,
  prerender: {
    paths: () => [
      "/",
      "/en",
      paths.fr.legal,
      paths.en.legal,
      "/404",
      "/en/404",
      ...projects.flatMap((p) => [paths.fr.project(p.slug), paths.en.project(p.slug)]),
    ],
    concurrency: 4,
  },
} satisfies Config;
