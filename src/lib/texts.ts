import type { LoanKind } from "@/lib/loans/types";

const kindLabels = {
  loan: {
    tab: "Prêts",
    sectionTitle: "Prêts",
    add: "Ajouter un prêt",
    edit: "Modifier le prêt",
    emptyTitle: "Aucun prêt pour le moment",
    emptyDescription:
      "Ajoute un premier objet prêté : nom, date, emprunteur et une photo optionnelle.",
    dateLabel: "Date du prêt",
    personLabel: "Emprunté par",
    deleteTitle: "Supprimer ce prêt ?",
    deleteMessage: (name: string, personName: string) =>
      `« ${name} » prêté à ${personName} sera définitivement supprimé.`,
    saveError: "Impossible d’enregistrer le prêt.",
    deleteError: "Impossible de supprimer le prêt.",
  },
  borrow: {
    tab: "Emprunts",
    sectionTitle: "Emprunts",
    add: "Ajouter un emprunt",
    edit: "Modifier l’emprunt",
    emptyTitle: "Aucun emprunt pour le moment",
    emptyDescription:
      "Ajoute un premier objet emprunté : nom, date, prêteur et une photo optionnelle.",
    dateLabel: "Date de l’emprunt",
    personLabel: "Prêté par",
    deleteTitle: "Supprimer cet emprunt ?",
    deleteMessage: (name: string, personName: string) =>
      `« ${name} » emprunté à ${personName} sera définitivement supprimé.`,
    saveError: "Impossible d’enregistrer l’emprunt.",
    deleteError: "Impossible de supprimer l’emprunt.",
  },
} as const;

function forKind(kind: LoanKind) {
  return kindLabels[kind];
}

// User-facing texts. Edit this file to change labels, titles, and messages.
export const texts = {
  app: {
    name: "Lendly",
    description: "Gestion des prêts et emprunts de matériel",
    subtitle: "Prête, emprunte, n’oublie plus rien.",
  },
  kinds: kindLabels,
  forKind,
  tabs: {
    label: "Rubriques",
  },
  actions: {
    edit: "Modifier",
    delete: "Supprimer",
    cancel: "Annuler",
    save: "Enregistrer",
  },
  loading: "Chargement…",
  table: {
    photo: "Photo",
    name: "Nom",
    actions: "Actions",
    photoPlaceholder: "—",
  },
  form: {
    photoLabel: "Photo de l’objet",
    photoAlt: "Aperçu de l’objet",
    photoCompressing: "Préparation de la vignette…",
    photoError:
      "Impossible de lire cette image. Réessaie avec un autre fichier.",
    chooseFile: "Choisir un fichier",
    takePhoto: "Prendre une photo",
    nameLabel: "Nom",
  },
  datePicker: {
    chooseDate: "Choisir une date",
  },
  theme: {
    label: "Thème d’affichage",
    light: "Clair",
    dark: "Sombre",
    system: "Système",
  },
  auth: {
    title: "Connexion",
    subtitle: "Un lien magique sera envoyé à ton e-mail.",
    emailLabel: "E-mail",
    submit: "Recevoir un lien",
    sending: "Envoi…",
    checkInbox: "Vérifie ta boîte mail pour te connecter.",
    error: "Impossible d’envoyer le lien. Réessaie.",
    callbackError: "Connexion impossible. Demande un nouveau lien.",
    completing: "Connexion en cours…",
    logout: "Se déconnecter",
    missingConfig:
      "Supabase n’est pas configuré. Copie .env.example vers .env.local et renseigne l’URL et la clé anon.",
  },
  errors: {
    load: "Impossible de charger les prêts et emprunts.",
    import: "Impossible d’importer les prêts locaux.",
  },
  migration: {
    title: (count: number) =>
      count === 1
        ? "1 prêt est encore enregistré sur cet appareil."
        : `${count} prêts sont encore enregistrés sur cet appareil.`,
    description:
      "Importe-les dans ton compte pour les retrouver sur tous tes appareils.",
    import: "Importer",
    dismiss: "Ignorer",
    importing: "Import…",
  },
};
