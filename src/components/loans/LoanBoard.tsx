"use client";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { LoanCard } from "@/components/loans/LoanCard";
import { LoanForm } from "@/components/loans/LoanForm";
import { LoanKindTabs } from "@/components/loans/LoanKindTabs";
import { LoanSection } from "@/components/loans/LoanSection";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Modal } from "@/components/ui/Modal";
import {
  dismissLocalLoansMigration,
  readPendingLocalLoans,
  type LocalLoan,
} from "@/lib/loans/localLoans";
import {
  addLoan,
  deleteLoan,
  importLocalLoans,
  listLoans,
  updateLoan,
} from "@/lib/loans/storage";
import type { Loan, LoanInput, LoanKind } from "@/lib/loans/types";
import { texts } from "@/lib/texts";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

function itemsOfKind(loans: Loan[], kind: LoanKind): Loan[] {
  return loans.filter((loan) => loan.kind === kind);
}

export function LoanBoard() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [createKind, setCreateKind] = useState<LoanKind>("loan");
  const [activeKind, setActiveKind] = useState<LoanKind>("loan");
  const [loanToEdit, setLoanToEdit] = useState<Loan | null>(null);
  const [loanToDelete, setLoanToDelete] = useState<Loan | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingLocalLoans, setPendingLocalLoans] = useState<LocalLoan[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  useBodyScrollLock(isFormOpen || loanToDelete !== null);

  const loanItems = useMemo(() => itemsOfKind(loans, "loan"), [loans]);
  const borrowItems = useMemo(() => itemsOfKind(loans, "borrow"), [loans]);
  const activeItems = activeKind === "loan" ? loanItems : borrowItems;
  const formKind = loanToEdit?.kind ?? createKind;
  const formLabels = texts.forKind(formKind);
  const deleteLabels = loanToDelete
    ? texts.forKind(loanToDelete.kind)
    : texts.forKind("loan");

  const refreshLoans = useCallback(async () => {
    const nextLoans = await listLoans();
    setLoans(nextLoans);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const nextLoans = await listLoans();
        if (!cancelled) {
          setLoans(nextLoans);
          setPendingLocalLoans(readPendingLocalLoans());
        }
      } catch {
        if (!cancelled) {
          setError(texts.errors.load);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  function openCreateForm(kind: LoanKind) {
    setCreateKind(kind);
    setLoanToEdit(null);
    setIsFormOpen(true);
    setError(null);
  }

  function openEditForm(loan: Loan) {
    setLoanToEdit(loan);
    setIsFormOpen(true);
    setError(null);
  }

  function closeForm() {
    if (isSaving) {
      return;
    }
    setIsFormOpen(false);
    setLoanToEdit(null);
  }

  async function handleSubmit(input: LoanInput) {
    setIsSaving(true);
    setError(null);
    try {
      if (loanToEdit) {
        await updateLoan(loanToEdit.id, input);
      } else {
        await addLoan(input);
      }
      await refreshLoans();
      setIsFormOpen(false);
      setLoanToEdit(null);
    } catch {
      setError(texts.forKind(formKind).saveError);
    } finally {
      setIsSaving(false);
    }
  }

  async function confirmDelete() {
    if (!loanToDelete) {
      return;
    }
    setIsDeleting(true);
    setError(null);
    try {
      await deleteLoan(loanToDelete.id);
      await refreshLoans();
      setLoanToDelete(null);
    } catch {
      setError(texts.forKind(loanToDelete.kind).deleteError);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleImportLocalLoans() {
    setIsImporting(true);
    setError(null);
    try {
      await importLocalLoans(pendingLocalLoans);
      setPendingLocalLoans([]);
      await refreshLoans();
    } catch {
      setError(texts.errors.import);
    } finally {
      setIsImporting(false);
    }
  }

  function handleDismissLocalLoans() {
    dismissLocalLoansMigration();
    setPendingLocalLoans([]);
  }

  const activeLabels = texts.forKind(activeKind);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex items-start justify-between gap-4 sm:block">
          <h1 className="m-0">
            <span className="sr-only">{texts.app.name}</span>
            <Image
              src="/icons/lendly_icon_light.png"
              alt=""
              width={699}
              height={690}
              priority
              unoptimized
              className="h-20 w-20 object-contain dark:hidden"
            />
            <Image
              src="/icons/lendly_icon_dark.png"
              alt=""
              width={722}
              height={717}
              priority
              unoptimized
              className="hidden h-20 w-20 object-contain dark:block"
            />
          </h1>
          <div className="flex items-center gap-2 sm:hidden">
            <LogoutButton />
            <ThemeToggle />
          </div>
          <p className="mt-1 hidden text-sm text-zinc-600 sm:block dark:text-zinc-400">
            {texts.app.subtitle}
          </p>
        </div>
        <p className="text-sm text-zinc-600 sm:hidden dark:text-zinc-400">
          {texts.app.subtitle}
        </p>
        <div className="hidden items-center gap-2 sm:flex">
          <LogoutButton />
          <ThemeToggle />
        </div>
      </header>

      {pendingLocalLoans.length > 0 ? (
        <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {texts.migration.title(pendingLocalLoans.length)}
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {texts.migration.description}
            </p>
          </div>
          <div className="flex shrink-0 justify-end gap-2">
            <button
              type="button"
              onClick={handleDismissLocalLoans}
              disabled={isImporting}
              className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {texts.migration.dismiss}
            </button>
            <button
              type="button"
              onClick={() => void handleImportLocalLoans()}
              disabled={isImporting}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {isImporting ? texts.migration.importing : texts.migration.import}
            </button>
          </div>
        </section>
      ) : null}

      {error && !isFormOpen && loanToDelete === null ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {texts.loading}
        </p>
      ) : (
        <>
          <div className="flex flex-col xl:hidden">
            <div className="sticky top-0 z-10 -mx-4 bg-background px-4 pt-3 pb-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <LoanKindTabs
                  activeKind={activeKind}
                  counts={{ loan: loanItems.length, borrow: borrowItems.length }}
                  onChange={setActiveKind}
                />
                <button
                  type="button"
                  onClick={() => openCreateForm(activeKind)}
                  className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                  {activeLabels.add}
                </button>
              </div>
            </div>
            {activeItems.length === 0 ? (
              <section className="flex flex-col items-center rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
                <p className="text-base font-medium text-zinc-900 dark:text-zinc-50">
                  {activeLabels.emptyTitle}
                </p>
                <p className="mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
                  {activeLabels.emptyDescription}
                </p>
                <button
                  type="button"
                  onClick={() => openCreateForm(activeKind)}
                  className="mt-6 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                  {activeLabels.add}
                </button>
              </section>
            ) : (
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {activeItems.map((loan) => (
                  <LoanCard
                    key={loan.id}
                    loan={loan}
                    onEdit={openEditForm}
                    onDelete={setLoanToDelete}
                  />
                ))}
              </section>
            )}
          </div>

          <div className="hidden flex-col gap-8 xl:flex">
            <LoanSection
              kind="loan"
              items={loanItems}
              onAdd={() => openCreateForm("loan")}
              onEdit={openEditForm}
              onDelete={setLoanToDelete}
            />
            <LoanSection
              kind="borrow"
              items={borrowItems}
              onAdd={() => openCreateForm("borrow")}
              onEdit={openEditForm}
              onDelete={setLoanToDelete}
            />
          </div>
        </>
      )}

      {isFormOpen ? (
        <Modal labelledBy="loan-form-title">
          <span id="loan-form-title" className="sr-only">
            {loanToEdit ? formLabels.edit : formLabels.add}
          </span>
          {error ? (
            <p className="mb-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          ) : null}
          <LoanForm
            key={loanToEdit?.id ?? `new-${createKind}`}
            loan={loanToEdit}
            kind={formKind}
            isSubmitting={isSaving}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        </Modal>
      ) : null}

      {loanToDelete ? (
        <Modal
          labelledBy="delete-title"
          maxWidthClassName="max-w-sm"
          zClassName="z-20"
        >
          <h2
            id="delete-title"
            className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
          >
            {deleteLabels.deleteTitle}
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {deleteLabels.deleteMessage(
              loanToDelete.name,
              loanToDelete.borrowerName,
            )}
          </p>
          {error ? (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          ) : null}
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setLoanToDelete(null)}
              disabled={isDeleting}
              className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {texts.actions.cancel}
            </button>
            <button
              type="button"
              onClick={() => void confirmDelete()}
              disabled={isDeleting}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {texts.actions.delete}
            </button>
          </div>
        </Modal>
      ) : null}
    </main>
  );
}
