import { formatLoanDate } from "@/lib/loans/dates";
import { texts } from "@/lib/texts";
import type { Loan } from "@/lib/loans/types";

type LoanRowProps = {
  loan: Loan;
  onEdit: (loan: Loan) => void;
  onDelete: (loan: Loan) => void;
};

export function LoanRow({ loan, onEdit, onDelete }: LoanRowProps) {
  return (
    <tr className="border-b border-zinc-200 last:border-b-0 dark:border-zinc-700">
      <td className="px-4 py-3">
        {loan.photoUrl ? (
          // Thumbnail comes from a signed Supabase Storage URL (or a local preview).
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={loan.photoUrl}
            alt=""
            className="h-12 w-12 rounded-md object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-md bg-zinc-200 text-xs text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
          >
            {texts.table.photoPlaceholder}
          </div>
        )}
      </td>
      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
        {loan.name}
      </td>
      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
        {formatLoanDate(loan.loanedAt)}
      </td>
      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
        {loan.borrowerName}
      </td>
      <td className="px-4 py-3 text-right">
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
      </td>
    </tr>
  );
}
