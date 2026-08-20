// User-facing texts. Edit this file to change labels, titles, and messages.
export const texts = {
  app: {
    name: "Lendly",
    description: "Gestion des prêts de matériel",
    subtitle: "Prêts de matériel synchronisés sur tes appareils.",
  },
  actions: {
    addLoan: "Ajouter un prêt",
    editLoan: "Modifier le prêt",
    edit: "Modifier",
    delete: "Supprimer",
    cancel: "Annuler",
    save: "Enregistrer",
  },
  emptyState: {
    title: "Aucun prêt pour le moment",
    description:
      "Ajoute un premier objet prêté : nom, date, emprunteur et une photo optionnelle.",
  },
  loading: "Chargement des prêts…",
  table: {
    photo: "Photo",
    name: "Nom",
    loanedAt: "Date du prêt",
    borrower: "Emprunté par",
    actions: "Actions",
    photoPlaceholder: "—",
  },
  form: {
    photoLabel: "Photo de l’objet",
    photoAlt: "Aperçu de l’objet",
    photoCompressing: "Préparation de la vignette…",
    photoError:
      "Impossible de lire cette image. Réessaie avec un autre fichier.",
    nameLabel: "Nom",
    loanedAtLabel: "Date du prêt",
    borrowerLabel: "Emprunté par",
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
  deleteLoan: {
    title: "Supprimer ce prêt ?",
    message: (name: string, borrowerName: string) =>
      `« ${name} » prêté à ${borrowerName} sera définitivement supprimé.`,
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
    load: "Impossible de charger les prêts.",
    save: "Impossible d’enregistrer le prêt.",
    delete: "Impossible de supprimer le prêt.",
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
