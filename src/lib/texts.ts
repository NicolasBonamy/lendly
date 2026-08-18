// User-facing texts. Edit this file to change labels, titles, and messages.
export const texts = {
  app: {
    name: "Lendly",
    description: "Gestion locale des prêts de matériel",
    subtitle: "Prêts de matériel enregistrés sur cet appareil.",
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
      `« ${name} » prêté à ${borrowerName} sera retiré de cet appareil.`,
  },
};
