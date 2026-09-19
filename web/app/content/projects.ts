import type { Project } from "./types";

/**
 * Single source of truth for every project shown on the site.
 * Order matters: it is the display order inside each tier.
 * Facts come from each repository; keep them verifiable.
 */
export const projects: Project[] = [
  {
    slug: "nexus-dashboard",
    name: "Nexus Dashboard",
    tier: "flagship",
    status: "live",
    kind: "web",
    url: "https://nexus.chevrolliernathan.fr",
    year: "2025 — 2026",
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "MySQL 8",
      "Drizzle",
      "NextAuth v5",
      "Socket.io",
      "Docker",
    ],
    accent: "#7c3aed",
    accent2: "#60a5fa",
    metrics: [
      { value: "14", label: { fr: "widgets", en: "widgets" } },
      { value: "46", label: { fr: "permissions typées", en: "typed permissions" } },
      { value: "148", label: { fr: "commits", en: "commits" } },
    ],
    copy: {
      fr: {
        tagline: "Tout votre univers. Sur un seul écran.",
        summary:
          "Un tableau de bord auto-hébergé où chaque utilisateur compose sa grille de widgets : liens surveillés, calendrier, médias, tâches, météo. Il se connecte à Jellyfin, Overseerr, TMDB, AniList, Spotify ou Discord, et intègre une messagerie en temps réel ainsi que des mini-jeux.",
        built: [
          "Grille de 14 widgets personnalisables, avec import et export JSON.",
          "Partage de tableaux en lecture ou en édition, et liens publics en lecture seule.",
          "Messagerie temps réel et 6 jeux avec classement, via un serveur Socket.io dédié.",
          "Rôles, 46 permissions typées et validation des nouveaux comptes par le propriétaire.",
          "7 thèmes (clair, sombre, OLED, cyber…) avec couleur principale personnalisable.",
          "Déploiement Docker : migrations isolées, secrets Docker, page de maintenance.",
        ],
        challenges: [
          {
            title: "Des secrets qui ne quittent jamais le serveur",
            body: "Les clés des intégrations sont chiffrées côté serveur et ne sont jamais envoyées au navigateur. Les appels passent tous par un proxy serveur.",
          },
          {
            title: "Refondre sans tout casser",
            body: "Le cœur de l'application a été refactorisé progressivement selon le modèle « strangler fig », documenté et couvert par des tests Playwright, pendant que la production continuait de tourner.",
          },
          {
            title: "Une CI qui surveille",
            body: "GitHub Actions lance les tests, gitleaks bloque toute fuite de secret et knip traque le code mort.",
          },
        ],
      },
      en: {
        tagline: "Your whole world. On one screen.",
        summary:
          "A self-hosted dashboard where every user builds their own grid of widgets: monitored links, calendar, media, tasks, weather. It connects to Jellyfin, Overseerr, TMDB, AniList, Spotify and Discord, and includes real-time chat and mini-games.",
        built: [
          "A grid of 14 customisable widgets, with JSON import and export.",
          "Board sharing with read or edit rights, plus public read-only links.",
          "Real-time messaging and 6 games with a leaderboard, on a dedicated Socket.io server.",
          "Roles, 46 typed permissions and owner approval of new accounts.",
          "7 themes (light, dark, OLED, cyber…) with a custom primary colour.",
          "Docker deployment: isolated migrations, Docker secrets, maintenance page.",
        ],
        challenges: [
          {
            title: "Secrets that never leave the server",
            body: "Integration keys are encrypted server-side and never sent to the browser. Every call goes through a server proxy.",
          },
          {
            title: "Rebuilding without breaking",
            body: "The core was refactored step by step using the strangler-fig pattern, documented and covered by Playwright tests, while production kept running.",
          },
          {
            title: "A CI that keeps watch",
            body: "GitHub Actions runs the tests, gitleaks blocks any leaked secret and knip hunts down dead code.",
          },
        ],
      },
    },
  },
  {
    slug: "scanlib",
    name: "ScanLib",
    tier: "flagship",
    status: "live",
    kind: "web",
    url: "https://scanlib.chevrolliernathan.fr",
    repo: "https://github.com/NathanChevrollier/ScanLib",
    year: "2026",
    stack: ["React", "Vite", "TypeScript", "Hono", "PostgreSQL 16", "Drizzle", "PWA", "Docker"],
    accent: "#6366f1",
    accent2: "#f472b6",
    metrics: [
      { value: "6", label: { fr: "sources de données", en: "data sources" } },
      { value: "~40", label: { fr: "plateformes légales", en: "legal platforms" } },
      { value: "4", label: { fr: "types de médias", en: "media types" } },
    ],
    copy: {
      fr: {
        tagline: "Mangas, animés, séries, films. Une seule bibliothèque.",
        summary:
          "Une PWA auto-hébergée qui réunit tout ce que vous lisez et regardez. Elle suit votre progression chapitre après chapitre, épisode après épisode, et vous renvoie automatiquement vers les plateformes légales qui les proposent.",
        built: [
          "Recherche unifiée sur MangaDex, MyAnimeList, AniList, Kitsu, TMDB et TVmaze, avec fusion et dédoublonnage des résultats.",
          "Moteur de résolution de liens vers une quarantaine de plateformes officielles (Crunchyroll, ADN, Netflix, Webtoon…).",
          "Calendrier des sorties et notifications push (VAPID), rafraîchies toutes les 6 heures par une tâche de fond.",
          "Heatmap d'activité sur un an, statistiques et tri « prêt à binger ».",
          "Fonctionne hors ligne, avec synchronisation au retour du réseau.",
        ],
        challenges: [
          {
            title: "Six API, un seul résultat",
            body: "Chaque source a son format et ses identifiants. Un package de providers normalise tout, puis les doublons sont fusionnés pour qu'une œuvre n'apparaisse qu'une fois.",
          },
          {
            title: "Une architecture en monorepo",
            body: "API Hono, front React et packages partagés (types, providers) vivent dans le même dépôt : une modification de contrat est vérifiée par TypeScript des deux côtés.",
          },
        ],
      },
      en: {
        tagline: "Manga, anime, shows, films. One library.",
        summary:
          "A self-hosted PWA that brings together everything you read and watch. It tracks your progress chapter by chapter, episode by episode, and automatically points you to the legal platforms that offer them.",
        built: [
          "Unified search across MangaDex, MyAnimeList, AniList, Kitsu, TMDB and TVmaze, with merged, de-duplicated results.",
          "A link-resolution engine covering about forty official platforms (Crunchyroll, ADN, Netflix, Webtoon…).",
          "Release calendar and push notifications (VAPID), refreshed every 6 hours by a background job.",
          "A year-long activity heatmap, stats and a “ready to binge” sort.",
          "Works offline and syncs when the network comes back.",
        ],
        challenges: [
          {
            title: "Six APIs, one result",
            body: "Each source has its own format and IDs. A providers package normalises everything, then duplicates are merged so a title only shows up once.",
          },
          {
            title: "A monorepo architecture",
            body: "The Hono API, the React front end and shared packages (types, providers) live in one repository, so any contract change is type-checked on both sides.",
          },
        ],
      },
    },
  },
  {
    slug: "neural-nexus",
    name: "Neural Nexus",
    tier: "flagship",
    status: "soon",
    kind: "web",
    repo: "https://github.com/NathanChevrollier/Neural-nexus-game",
    year: "2026",
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "React Three Fiber",
      "PostgreSQL 17",
      "Drizzle",
      "Zustand",
      "PWA",
    ],
    accent: "#2bf5c4",
    accent2: "#e24bff",
    metrics: [
      { value: "6", label: { fr: "stades d'évolution", en: "evolution stages" } },
      { value: "10⁸⁰", label: { fr: "op/s pour gagner", en: "op/s to win" } },
      { value: "0", label: { fr: "fichier audio", en: "audio files" } },
    ],
    copy: {
      fr: {
        tagline: "D'un neurone à une superintelligence.",
        summary:
          "Un jeu incrémental où l'on fait grandir un cerveau, d'un simple neurone jusqu'à une intelligence cosmique. Mutations, recherche, système immunitaire en temps réel contre des intrus, et prestige.",
        built: [
          "Moteur de jeu en TypeScript pur, totalement découplé de React et testé.",
          "Cœur 3D dont les shaders réagissent à l'état de la partie, modélisé dans Blender.",
          "Sons entièrement synthétisés avec la Web Audio API, sans aucun fichier audio.",
          "Comptes, classement, mode invité et gains hors ligne, en PWA installable.",
          "Simulateur d'équilibrage pour valider la progression avant de la jouer.",
        ],
        challenges: [
          {
            title: "Des nombres trop grands pour JavaScript",
            body: "La progression dépasse largement Number.MAX_VALUE : les calculs utilisent break_infinity.js, et l'équilibrage est vérifié par simulation.",
          },
          {
            title: "La 3D au service du jeu",
            body: "Le cerveau n'est pas décoratif : ses shaders traduisent en temps réel la vitesse de pensée et le stade atteint.",
          },
        ],
      },
      en: {
        tagline: "From one neuron to a superintelligence.",
        summary:
          "An incremental game where you grow a brain from a single neuron to a cosmic intelligence. Mutations, research, a real-time immune system fighting intruders, and prestige.",
        built: [
          "A pure TypeScript game engine, fully decoupled from React and tested.",
          "A 3D core modelled in Blender, with shaders that react to the game state.",
          "Fully synthesised sound with the Web Audio API — not a single audio file.",
          "Accounts, leaderboard, guest mode and offline gains, as an installable PWA.",
          "A balancing simulator to validate progression before playing it.",
        ],
        challenges: [
          {
            title: "Numbers too big for JavaScript",
            body: "Progression goes far beyond Number.MAX_VALUE: maths run on break_infinity.js, and balance is checked by simulation.",
          },
          {
            title: "3D that serves the game",
            body: "The brain is not decoration: its shaders show thinking speed and the current stage in real time.",
          },
        ],
      },
    },
  },
  {
    slug: "myanswer",
    name: "MyAnswer",
    tier: "lab",
    status: "wip",
    kind: "desktop",
    year: "2026",
    stack: ["C#", ".NET 10", "WPF", "MVVM", "xUnit"],
    accent: "#33b7c6",
    accent2: "#d9c6a5",
    metrics: [
      { value: "6", label: { fr: "projets .NET", en: ".NET projects" } },
      { value: "5", label: { fr: "suites de tests", en: "test suites" } },
    ],
    copy: {
      fr: {
        tagline: "Il lit le damier. Il trouve le coup.",
        summary:
          "Une application Windows pour les dames internationales : elle lit le plateau à l'écran, déduit le coup joué et propose la meilleure réponse, en l'expliquant.",
        built: [
          "Générateur de coups sur bitboards, avec les règles de prise obligatoire.",
          "Moteur alpha-bêta avec approfondissement itératif et table de transposition (hachage de Zobrist).",
          "Vision par ordinateur : capture d'écran, calibrage du plateau et des couleurs, inférence du coup.",
          "Lecture et écriture de parties au format PDN, et mode éditeur.",
        ],
        challenges: [
          {
            title: "La vitesse avant tout",
            body: "Chaque position est encodée en entiers 64 bits pour générer les coups en quelques instructions. Un banc de test « perft » mesure et valide le générateur.",
          },
        ],
      },
      en: {
        tagline: "It reads the board. It finds the move.",
        summary:
          "A Windows app for international draughts: it reads the board on screen, works out the move just played and suggests the best reply, with an explanation.",
        built: [
          "A bitboard move generator that enforces mandatory captures.",
          "An alpha-beta engine with iterative deepening and a transposition table (Zobrist hashing).",
          "Computer vision: screen capture, board and colour calibration, move inference.",
          "PDN game import and export, and an editor mode.",
        ],
        challenges: [
          {
            title: "Speed first",
            body: "Each position is encoded as 64-bit integers so moves are generated in a few instructions. A perft benchmark measures and validates the generator.",
          },
        ],
      },
    },
  },
  {
    slug: "nexus-rpg",
    name: "Nexus RPG",
    tier: "lab",
    status: "wip",
    kind: "game-mod",
    repo: "https://github.com/NathanChevrollier/Nexus-RPG",
    year: "2026",
    stack: ["Java 21", "NeoForge", "Minecraft 1.21", "GeckoLib", "Gradle"],
    accent: "#f59e0b",
    accent2: "#b91c1c",
    metrics: [
      { value: "100", label: { fr: "étages de tour", en: "tower floors" } },
      { value: "300", label: { fr: "armes prévues", en: "planned weapons" } },
    ],
    copy: {
      fr: {
        tagline: "Une tour. Cent étages. Cent boss.",
        summary:
          "Un mod Minecraft de fantasy héroïque, inspiré de Solo Leveling, Tensura et Sword Art Online : races, noyau de mana, arbre de compétences sans classe fixe, et une dimension dédiée.",
        built: [
          "Système de races, de difficulté et de noyau de mana.",
          "Équipements du Commun au Mythique avec affixes aléatoires.",
          "IA de boss personnalisée et génération de données automatisée.",
          "Pipeline d'assets assisté par IA avec étapes de validation.",
        ],
        challenges: [
          {
            title: "Du contenu à grande échelle",
            body: "Des centaines d'objets et de compétences sont décrits sous forme de catalogues, puis générés automatiquement plutôt qu'écrits à la main.",
          },
        ],
      },
      en: {
        tagline: "One tower. A hundred floors. A hundred bosses.",
        summary:
          "A heroic-fantasy Minecraft mod inspired by Solo Leveling, Tensura and Sword Art Online: races, a mana core, a class-free skill tree and its own dimension.",
        built: [
          "Race, difficulty and mana-core systems.",
          "Gear from Common to Mythic with random affixes.",
          "Custom boss AI and automated data generation.",
          "An AI-assisted asset pipeline with review gates.",
        ],
        challenges: [
          {
            title: "Content at scale",
            body: "Hundreds of items and skills are described as catalogues, then generated automatically instead of written by hand.",
          },
        ],
      },
    },
  },
  {
    slug: "trailmate",
    name: "TrailMate",
    tier: "lab",
    status: "shipped",
    kind: "mobile",
    repo: "https://github.com/NathanChevrollier/dev_mobile",
    year: "2026",
    stack: ["React Native", "Expo", "JavaScript", "Leaflet", "AsyncStorage"],
    accent: "#4fd1c5",
    accent2: "#f6ad55",
    metrics: [{ value: "6", label: { fr: "capteurs exploités", en: "sensors used" } }],
    copy: {
      fr: {
        tagline: "Chaque pas compte. Littéralement.",
        summary:
          "Un carnet de randonnée mobile : tracé GPS en direct, photos géolocalisées, podomètre, boussole et dénivelé mesuré au baromètre. Tout fonctionne hors ligne.",
        built: [
          "Suivi GPS en direct sur carte et reprise d'une randonnée après fermeture de l'app.",
          "Photos géolocalisées, podomètre, boussole et dénivelé par baromètre.",
          "Retour haptique à chaque kilomètre et bilan de fin de sortie.",
          "Hooks dédiés à chaque capteur et parcours de permissions soigné.",
        ],
        challenges: [
          {
            title: "Six capteurs, une batterie",
            body: "Chaque capteur est isolé dans son propre hook, qui s'abonne et se désabonne proprement pour ne consommer que lorsque c'est utile.",
          },
        ],
      },
      en: {
        tagline: "Every step counts. Literally.",
        summary:
          "A mobile hiking logbook: live GPS track, geotagged photos, pedometer, compass and barometric elevation gain. Everything works offline.",
        built: [
          "Live GPS tracking on a map, and resuming a hike after the app is closed.",
          "Geotagged photos, pedometer, compass and barometric elevation.",
          "Haptic feedback at every kilometre and an end-of-hike summary.",
          "One hook per sensor and a careful permission flow.",
        ],
        challenges: [
          {
            title: "Six sensors, one battery",
            body: "Each sensor lives in its own hook that subscribes and unsubscribes cleanly, so it only draws power when needed.",
          },
        ],
      },
    },
  },
  {
    slug: "palworld-calculator",
    name: "Palworld Calculator",
    tier: "lab",
    status: "wip",
    kind: "web",
    year: "2026",
    stack: ["JavaScript", "IndexedDB", "WebAssembly", "Node.js"],
    accent: "#8b5cf6",
    accent2: "#6366f1",
    metrics: [{ value: "2", label: { fr: "formats de sauvegarde", en: "save formats" } }],
    copy: {
      fr: {
        tagline: "Votre sauvegarde, lue dans le navigateur.",
        summary:
          "Un calculateur pour le jeu Palworld : arbre de fabrication complet, ressources brutes, planificateur d'élevage, et exploration de vos propres Pals directement depuis votre fichier de sauvegarde.",
        built: [
          "Arbre de fabrication et calcul des ressources brutes pour n'importe quel objet.",
          "Suivi des tâches et du stock, planificateur d'élevage.",
          "Lecture des sauvegardes Level.sav dans le navigateur, en zlib comme en Oodle.",
          "Données générées à partir des fichiers du jeu par des scripts Node.",
        ],
        challenges: [
          {
            title: "Décompresser de l'Oodle côté client",
            body: "Les sauvegardes récentes utilisent la compression Oodle : un décodeur compilé en WebAssembly permet de les lire sans serveur.",
          },
        ],
      },
      en: {
        tagline: "Your save file, read in the browser.",
        summary:
          "A calculator for the game Palworld: full crafting tree, raw resources, a breeding planner, and a browser for your own Pals straight from your save file.",
        built: [
          "Crafting tree and raw-resource totals for any item.",
          "Todo and stock tracking, and a breeding planner.",
          "Reads Level.sav saves in the browser, both zlib and Oodle.",
          "Game data generated from the game files by Node scripts.",
        ],
        challenges: [
          {
            title: "Decompressing Oodle client-side",
            body: "Recent saves use Oodle compression: a decoder compiled to WebAssembly reads them with no server involved.",
          },
        ],
      },
    },
  },
  {
    slug: "algocluck",
    name: "AlgoCluck",
    tier: "archive",
    status: "live",
    kind: "web",
    url: "https://algocluck.chevrolliernathan.fr",
    year: "2025",
    stack: ["React", "TypeScript", "Express", "MySQL"],
    accent: "#f97316",
    accent2: "#facc15",
    metrics: [],
    copy: {
      fr: {
        tagline: "Apprendre l'anglais, un quiz à la fois.",
        summary:
          "Un jeu de quiz d'anglais avec tableau des scores : front React/TypeScript, API Express et base MySQL.",
        built: ["Quiz interactif, enregistrement des scores et classement des meilleurs joueurs."],
        challenges: [],
      },
      en: {
        tagline: "Learning English, one quiz at a time.",
        summary:
          "An English quiz game with a leaderboard: React/TypeScript front end, Express API and MySQL database.",
        built: ["Interactive quiz, score saving and a top-players leaderboard."],
        challenges: [],
      },
    },
  },
  {
    slug: "cinemap",
    name: "CinéMap",
    tier: "archive",
    // Live site still shows the Laravel welcome page: no public link until it is fixed.
    status: "shipped",
    kind: "web",
    repo: "https://github.com/NathanChevrollier/Projet-Laravel",
    year: "2026",
    stack: ["Laravel", "PHP 8.2", "JWT", "Stripe", "Docker"],
    accent: "#ef4444",
    accent2: "#f59e0b",
    metrics: [],
    copy: {
      fr: {
        tagline: "Les lieux de tournage de vos films.",
        summary:
          "Projet d'équipe en Laravel : gestion des lieux de tournage, votes asynchrones via jobs et queues, API protégée par JWT et réservée aux abonnés Stripe, et serveur MCP.",
        built: [
          "Connexion GitHub (OAuth), policies et middleware d'administration.",
          "Votes traités en file d'attente et nettoyage planifié des lieux obsolètes.",
        ],
        challenges: [],
      },
      en: {
        tagline: "Where your favourite films were shot.",
        summary:
          "A team project in Laravel: filming-location management, asynchronous votes through jobs and queues, a JWT-protected API reserved for Stripe subscribers, and an MCP server.",
        built: [
          "GitHub login (OAuth), policies and an admin middleware.",
          "Queued vote processing and scheduled clean-up of stale locations.",
        ],
        challenges: [],
      },
    },
  },
];

export const byTier = (tier: Project["tier"]) => projects.filter((p) => p.tier === tier);
export const findProject = (slug: string) => projects.find((p) => p.slug === slug);
