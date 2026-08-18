"use client";

import { useState, useSyncExternalStore } from "react";
import { LoanForm } from "@/components/loans/LoanForm";
import { LoanRow } from "@/components/loans/LoanRow";
import {
  addLoan,
  deleteLoan,
  getLoansServerSnapshot,
  getLoansSnapshot,
  parseLoansSnapshot,
  subscribeLoans,
  updateLoan,
} from "@/lib/loans/storage";
import type { Loan, LoanInput } from "@/lib/loans/types";

export function LoanBoard() {
  const loansSnapshot = useSyncExternalStore(
    subscribeLoans,
    getLoansSnapshot,
    getLoansServerSnapshot,
  );
  const loans = parseLoansSnapshot(loansSnapshot);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loanToEdit, setLoanToEdit] = useState<Loan | null>(null);
  const [loanToDelete, setLoanToDelete] = useState<Loan | null>(null);

  function openCreateForm() {
    setLoanToEdit(null);
    setIsFormOpen(true);
  }

  function openEditForm(loan: Loan) {
    setLoanToEdit(loan);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setLoanToEdit(null);
  }

  function handleSubmit(input: LoanInput) {
    if (loanToEdit) {
      updateLoan(loanToEdit.id, input);
    } else {
      addLoan(input);
    }
    closeForm();
  }

  function confirmDelete() {
    if (!loanToDelete) {
      return;
    }
    deleteLoan(loanToDelete.id);
    setLoanToDelete(null);
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Lendly
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Prêts de matériel enregistrés sur cet appareil.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Ajouter un prêt
        </button>
      </header>

      {loans.length === 0 ? (
        <section className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-base font-medium text-zinc-900 dark:text-zinc-50">
            Aucun prêt pour le moment
          </p>
          <p className="mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
            Ajoute un premier objet prêté : nom, date, emprunteur et une photo
            optionnelle.
          </p>
          <button
            type="button"
            onClick={openCreateForm}
            className="mt-6 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Ajouter un prêt
          </button>
        </section>
      ) : (
        <section className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Photo</th>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Date du prêt</th>
                <th className="px-4 py-3 font-medium">Emprunté par</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <LoanRow
                  key={loan.id}
                  loan={loan}
                  onEdit={openEditForm}
                  onDelete={setLoanToDelete}
                />
              ))}
            </tbody>
          </table>
        </section>
      )}

      {isFormOpen ? (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="loan-form-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900"
          >
            <span id="loan-form-title" className="sr-only">
              {loanToEdit ? "Modifier le prêt" : "Ajouter un prêt"}
            </span>
            <LoanForm
              key={loanToEdit?.id ?? "new"}
              loan={loanToEdit}
              onSubmit={handleSubmit}
              onCancel={closeForm}
            />
          </div>
        </div>
      ) : null}

      {loanToDelete ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900"
          >
            <h2
              id="delete-title"
              className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
            >
              Supprimer ce prêt ?
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              « {loanToDelete.name} » prêté à {loanToDelete.borrowerName} sera
              retiré de cet appareil.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setLoanToDelete(null)}
                className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
