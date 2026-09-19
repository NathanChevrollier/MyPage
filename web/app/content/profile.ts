import type { Localized } from "./types";

export const SITE_URL = "https://chevrolliernathan.fr";

export const profile = {
  name: "Nathan Chevrollier",
  firstName: "Nathan",
  /** City of residence (legal notice). */
  city: "Challans",
  /** Where the work-study position is sought. */
  searchAreas: "Nantes · Challans",
  github: "https://github.com/NathanChevrollier",
  linkedin: "https://www.linkedin.com/in/nathan-chevrollier-3ba923277/",
  /** Split so the address never appears in the static HTML (basic scraper protection). */
  email: { user: "nathan.chevrollier17pro", domain: "gmail.com" },
  /** Served from web/public/cv/. */
  cv: "nathan-chevrollier-cv.pdf",
} as const;

export interface TimelineEntry {
  period: Localized<string>;
  title: Localized<string>;
  place: string;
  body: Localized<string>;
  link?: { href: string; label: Localized<string> };
  kind: "now" | "work" | "school";
}

/** Most recent first. Source: CV (informations_documents/, not versioned). */
export const timeline: TimelineEntry[] = [
  {
    kind: "now",
    period: { fr: "Rentrée 2026", en: "From 2026" },
    title: {
      fr: "Recherche d'alternance — Master EADL",
      en: "Seeking a work-study position — Master's degree",
    },
    place: "ENI · Nantes / Challans",
    body: {
      fr: "Je cherche une alternance de deux ans pour préparer à l'ENI le titre d'Expert en Architecture et Développement Logiciel (niveau Master).",
      en: "I am looking for a two-year work-study position to prepare the Software Architecture & Development Expert degree (Master's level) at ENI.",
    },
  },
  {
    kind: "work",
    period: { fr: "Juil. 2025 — sept. 2026", en: "Jul 2025 — Sep 2026" },
    title: { fr: "Développeur junior", en: "Junior developer" },
    place: "TheWatchDog",
    body: {
      fr: "APIs REST en Nest.js et TypeScript, nouvelles fonctionnalités côté React, analyse et correction de bugs. Travail en équipe agile : daily, revues de code, Git.",
      en: "REST APIs with Nest.js and TypeScript, new React features, bug analysis and fixes. Agile teamwork: dailies, code reviews, Git.",
    },
  },
  {
    kind: "school",
    period: { fr: "2025 — 2026", en: "2025 — 2026" },
    title: {
      fr: "Titre Concepteur Développeur d'Applications",
      en: "Application Designer & Developer degree",
    },
    place: "Formation en alternance",
    body: {
      fr: "Conception et développement d'applications de bout en bout, en parallèle de mon poste chez TheWatchDog.",
      en: "End-to-end application design and development, alongside my position at TheWatchDog.",
    },
  },
  {
    kind: "work",
    period: { fr: "Oct. — déc. 2024", en: "Oct — Dec 2024" },
    title: { fr: "Développeur front-end (stage)", en: "Front-end developer (internship)" },
    place: "NK Informatique",
    body: {
      fr: "Création de cours et d'exercices React progressifs, orientés pratique : manipulation du DOM, hooks, correction d'erreurs.",
      en: "Wrote progressive, hands-on React courses and exercises: DOM manipulation, hooks, debugging.",
    },
    link: {
      href: "https://www.linkedin.com/posts/kevinniel_je-suis-ravi-de-vous-annoncer-lajout-de-activity-7293191701983080448-FrhR",
      label: { fr: "Lire la recommandation", en: "Read the recommendation" },
    },
  },
  {
    kind: "work",
    period: { fr: "Déc. 2023 — sept. 2024", en: "Dec 2023 — Sep 2024" },
    title: {
      fr: "Technicien support et réseau (alternance)",
      en: "Support & network technician (work-study)",
    },
    place: "My-Micro",
    body: {
      fr: "Vente et réparation de matériel informatique, assistance réseau auprès de particuliers et de professionnels.",
      en: "Computer hardware sales and repair, network support for individuals and businesses.",
    },
  },
  {
    kind: "school",
    period: { fr: "2023 — 2025", en: "2023 — 2025" },
    title: { fr: "BTS SIO — option SLAM", en: "BTS SIO — software development track" },
    place: "Solutions logicielles et applications métiers",
    body: {
      fr: "Développement web et mobile, bases de données, gestion de projet.",
      en: "Two-year French degree: web and mobile development, databases, project management.",
    },
  },
  {
    kind: "school",
    period: { fr: "2022", en: "2022" },
    title: { fr: "Baccalauréat général", en: "French baccalauréat" },
    place: "NSI · LLCE anglais",
    body: {
      fr: "Spécialités numérique et sciences informatiques, et langues, littératures et cultures étrangères (anglais).",
      en: "Majors in computer science and English language, literature and culture.",
    },
  },
];

export interface SkillGroup {
  title: Localized<string>;
  items: string[] | Localized<string[]>;
}

export const skills: SkillGroup[] = [
  {
    title: { fr: "Langages", en: "Languages" },
    items: ["TypeScript", "JavaScript", "PHP", "Python", "C#", "C++", "Java", "SQL"],
  },
  {
    title: { fr: "Front-end", en: "Front end" },
    items: ["React", "Next.js", "React Native", "Vue", "Three.js / R3F", "Tailwind"],
  },
  {
    title: { fr: "Back-end", en: "Back end" },
    items: ["Node.js", "Nest.js", "Hono", "Express", "Laravel", "Socket.io"],
  },
  {
    title: { fr: "Données", en: "Data" },
    items: ["PostgreSQL", "MySQL", "MongoDB", "Drizzle ORM", "IndexedDB"],
  },
  {
    title: { fr: "Infra & DevOps", en: "Infra & DevOps" },
    items: ["Docker", "nginx", "Linux (Debian)", "GitHub Actions", "Let's Encrypt"],
  },
  {
    title: { fr: "Méthodes & outils", en: "Practices & tools" },
    items: ["Agile / Scrum", "Code review", "Git", "Vitest", "Playwright", "Blender"],
  },
  {
    title: { fr: "Langues", en: "Languages spoken" },
    items: {
      fr: ["Français (langue maternelle)", "Anglais — TOEIC 875", "Cambridge B1"],
      en: ["French (native)", "English — TOEIC 875", "Cambridge B1"],
    },
  },
];
