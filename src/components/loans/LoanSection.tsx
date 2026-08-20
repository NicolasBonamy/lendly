import { LoanRow } from "@/components/loans/LoanRow";
import type { Loan, LoanKind } from "@/lib/loans/types";
import { texts } from "@/lib/texts";

type LoanSectionProps = {
  kind: LoanKind;
  items: Loan[];
  onAdd: () => void;
  onEdit: (loan: Loan) => void;
  onDelete: (loan: Loan) => void;
};

export function LoanSection({
  kind,
  items,
  onAdd,
  onEdit,
  onDelete,
}: LoanSectionProps) {
  const labels = texts.forKind(kind);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {labels.sectionTitle}
        </h2>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {labels.add}
        </button>
      </div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-base font-medium text-zinc-900 dark:text-zinc-50">
            {labels.emptyTitle}
          </p>
          <p className="mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
            {labels.emptyDescription}
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="mt-6 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {labels.add}
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">{texts.table.photo}</th>
                <th className="px-4 py-3 font-medium">{texts.table.name}</th>
                <th className="px-4 py-3 font-medium">{labels.dateLabel}</th>
                <th className="px-4 py-3 font-medium">{labels.personLabel}</th>
                <th className="px-4 py-3 text-right font-medium">
                  {texts.table.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((loan) => (
                <LoanRow
                  key={loan.id}
                  loan={loan}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
