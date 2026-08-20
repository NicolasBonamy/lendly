"use client";

import { FormEvent, useId, useState } from "react";
import { DatePicker } from "@/components/loans/DatePicker";
import { compressImageToThumbnail } from "@/lib/loans/image";
import { todayIsoDate } from "@/lib/loans/dates";
import { texts } from "@/lib/texts";
import type { Loan, LoanInput } from "@/lib/loans/types";

type LoanFormProps = {
  loan?: Loan | null;
  isSubmitting?: boolean;
  onSubmit: (input: LoanInput) => void | Promise<void>;
  onCancel: () => void;
};

export function LoanForm({
  loan,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: LoanFormProps) {
  const [name, setName] = useState(loan?.name ?? "");
  const [loanedAt, setLoanedAt] = useState(loan?.loanedAt ?? todayIsoDate());
  const [borrowerName, setBorrowerName] = useState(loan?.borrowerName ?? "");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(
    loan?.photoUrl ?? null,
  );
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const loanedAtFieldId = useId();

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
      setPhotoError(texts.form.photoError);
    } finally {
      setIsCompressing(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      name,
      loanedAt,
      borrowerName,
      photoDataUrl,
    });
  }

  const title = loan ? texts.actions.editLoan : texts.actions.addLoan;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          {texts.form.photoLabel}
        </span>
        {photoDataUrl ? (
          // Preview of the compressed thumbnail before save.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoDataUrl}
            alt={texts.form.photoAlt}
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
          <span className="text-zinc-500">{texts.form.photoCompressing}</span>
        ) : null}
        {photoError ? <span className="text-red-600">{photoError}</span> : null}
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          {texts.form.nameLabel}
        </span>
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>

      <div className="flex flex-col gap-1 text-sm">
        <label
          htmlFor={loanedAtFieldId}
          className="font-medium text-zinc-700 dark:text-zinc-200"
        >
          {texts.form.loanedAtLabel}
        </label>
        <DatePicker
          id={loanedAtFieldId}
          value={loanedAt}
          onChange={setLoanedAt}
        />
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          {texts.form.borrowerLabel}
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
          disabled={isSubmitting}
          className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          {texts.actions.cancel}
        </button>
        <button
          type="submit"
          disabled={isCompressing || isSubmitting}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {texts.actions.save}
        </button>
      </div>
    </form>
  );
}
