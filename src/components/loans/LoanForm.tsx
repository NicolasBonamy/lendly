"use client";

import { FormEvent, useState } from "react";
import { compressImageToThumbnail } from "@/lib/loans/image";
import { todayIsoDate } from "@/lib/loans/dates";
import type { Loan, LoanInput } from "@/lib/loans/types";

type LoanFormProps = {
  loan?: Loan | null;
  onSubmit: (input: LoanInput) => void;
  onCancel: () => void;
};

export function LoanForm({ loan, onSubmit, onCancel }: LoanFormProps) {
  const [name, setName] = useState(loan?.name ?? "");
  const [loanedAt, setLoanedAt] = useState(loan?.loanedAt ?? todayIsoDate());
  const [borrowerName, setBorrowerName] = useState(loan?.borrowerName ?? "");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(
    loan?.photoDataUrl ?? null,
  );
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  async function handlePhotoChange(file: File | undefined) {
    setPhotoError(null);
    if (!file) {
      return;
    }

    setIsCompressing(true);
    try {
      const thumbnail = await compressImageToThumbnail(file);
      setPhotoDataUrl(thumbnail);
    } catch {
      setPhotoError("Impossible de lire cette image. Réessaie avec un autre fichier.");
    } finally {
      setIsCompressing(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      name,
      loanedAt,
      borrowerName,
      photoDataUrl,
    });
  }

  const title = loan ? "Modifier le prêt" : "Ajouter un prêt";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          Photo de l’objet
        </span>
        {photoDataUrl ? (
          // Preview of the compressed thumbnail before save.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoDataUrl}
            alt="Aperçu de l’objet"
            className="h-20 w-20 rounded-md object-cover"
          />
        ) : null}
        <input
          type="file"
          accept="image/*"
          onChange={(event) => handlePhotoChange(event.target.files?.[0])}
          className="text-sm text-zinc-600 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-800 dark:text-zinc-300 dark:file:bg-zinc-800 dark:file:text-zinc-100"
        />
        {isCompressing ? (
          <span className="text-zinc-500">Préparation de la vignette…</span>
        ) : null}
        {photoError ? <span className="text-red-600">{photoError}</span> : null}
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-200">Nom</span>
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          Date du prêt
        </span>
        <input
          required
          type="date"
          value={loanedAt}
          onChange={(event) => setLoanedAt(event.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          Emprunté par
        </span>
        <input
          required
          value={borrowerName}
          onChange={(event) => setBorrowerName(event.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isCompressing}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}
