import { type RouteConfig, index, route } from "@react-router/dev/routes";

/**
 * French lives at the root, English under /en. Each page module is shared by both
 * languages; the language is derived from the URL (see ~/i18n).
 */
export default [
  index("routes/home.tsx", { id: "home-fr" }),
  route("en", "routes/home.tsx", { id: "home-en" }),
  route("projets/:slug", "routes/project.tsx", { id: "project-fr" }),
  route("en/projects/:slug", "routes/project.tsx", { id: "project-en" }),
  route("mentions-legales", "routes/legal.tsx", { id: "legal-fr" }),
  route("en/legal", "routes/legal.tsx", { id: "legal-en" }),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
