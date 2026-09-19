# chevrolliernathan.fr

Site vitrine de Nathan Chevrollier, servi sur le domaine racine. Il présente le parcours et les
compétences, et renvoie vers chaque application déployée sur le VPS (un sous-domaine chacune),
avec son statut en direct.

## Stack

|        |                                                                                                                                                                  |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Front  | React 19, TypeScript strict, React Router 8 en mode framework, **prérendu statique** (FR `/`, EN `/en`)                                                          |
| Styles | CSS Modules + tokens (`web/app/styles/global.css`), pas de framework CSS                                                                                         |
| 3D     | three.js / react-three-fiber, modèle Blender (`blender/laptop.blend` → `web/public/models/laptop.glb`, meshopt, 106 Ko), chargé en différé sur bureau uniquement |
| Statut | `status/` : micro-service Hono qui sonde les sites toutes les 60 s, sans base de données                                                                         |
| Prod   | Docker (nginx non privilégié + Node), derrière le nginx de l'hôte ; images publiées sur GHCR par la CI                                                           |

Aucune base de données : le contenu est versionné dans `web/app/content/` et typé.

## Développer

```bash
npm ci
npm run dev                         # site sur http://localhost:5173
npm run dev -w status               # (optionnel) API de statut sur :3101, relayée par Vite
```

## Qualité

```bash
npm run lint && npm run typecheck && npm test   # ESLint (a11y incluse), tsc, Vitest
npm run build && npx playwright test            # e2e + audit axe (WCAG 2.1 AA), bureau et mobile
```

Budgets : JS initial ≤ 125 Ko gzip (dont ~97 Ko pour React et React Router), CLS 0. La CSP est calculée au build à partir des empreintes de
chaque script inline (`scripts/csp.mjs`) : ni `unsafe-inline` ni `unsafe-eval`.

## Contenu et médias

- Projets : `web/app/content/projects.ts`. Un test vérifie que `content/sites.json` (les sites sondés) reste synchronisé.
- Parcours et compétences : `web/app/content/profile.ts`. Interface : `web/app/i18n/dict.ts` (une clé manquante en anglais est une erreur de compilation).
- Captures : `node scripts/screenshots.mjs`, puis déclarer les images dans `scripts/media.config.mjs`, puis `node scripts/optimize-images.mjs` (AVIF/WebP en 640/1280/2560).
- Images Open Graph et icône Apple : `node scripts/og.mjs`.

## Déployer

Voir [deploy/README.md](deploy/README.md).
