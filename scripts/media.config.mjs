// Which source images become site media. Sources live in media-src/<slug>/.
// `hero` is the main visual of a project; `gallery` appears on its page.
// Only use screenshots that show the product itself (never a login screen).

export default {
  "nexus-dashboard": {
    hero: {
      src: "app-view.png",
      alt: {
        fr: "Tableau de bord Nexus : horloge, liens surveillés, aide-mémoire, accès rapides et minuteur Pomodoro",
        en: "Nexus dashboard: clock, monitored links, notes, quick links and a Pomodoro timer",
      },
    },
    gallery: [
      {
        src: "app-edit.png",
        alt: { fr: "Mode édition de la grille de widgets", en: "Widget grid in edit mode" },
      },
      {
        src: "app-catalog.png",
        alt: { fr: "Catalogue des widgets disponibles", en: "Catalogue of available widgets" },
      },
    ],
  },
};
