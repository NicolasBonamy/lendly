import { formatLoanDate } from "@/lib/loans/dates";
import { texts } from "@/lib/texts";
import type { Loan } from "@/lib/loans/types";

type LoanCardProps = {
  loan: Loan;
  onEdit: (loan: Loan) => void;
  onDelete: (loan: Loan) => void;
};

export function LoanCard({ loan, onEdit, onDelete }: LoanCardProps) {
  const labels = texts.forKind(loan.kind);

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex gap-4">
        {loan.photoUrl ? (
          // Thumbnail comes from a signed Supabase Storage URL (or a local preview).
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={loan.photoUrl}
            alt=""
            className="h-20 w-20 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-zinc-200 text-sm text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
          >
            {texts.table.photoPlaceholder}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {loan.name}
          </h2>
          <dl className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-300">
            <div>
              <dt className="inline text-zinc-500 dark:text-zinc-400">
                {labels.dateLabel} :{" "}
              </dt>
              <dd className="inline">{formatLoanDate(loan.loanedAt)}</dd>
            </div>
            <div>
              <dt className="inline text-zinc-500 dark:text-zinc-400">
                {labels.personLabel} :{" "}
              </dt>
              <dd className="inline">{loan.borrowerName}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => onEdit(loan)}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          {texts.actions.edit}
        </button>
        <button
          type="button"
          onClick={() => onDelete(loan)}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          {texts.actions.delete}
        </button>
      </div>
    </article>
  );
}
