import { LOAN_KINDS, type LoanKind } from "@/lib/loans/types";
import { texts } from "@/lib/texts";

type LoanKindTabsProps = {
  activeKind: LoanKind;
  counts: Record<LoanKind, number>;
  onChange: (kind: LoanKind) => void;
};

export function LoanKindTabs({
  activeKind,
  counts,
  onChange,
}: LoanKindTabsProps) {
  return (
    <div
      role="tablist"
      aria-label={texts.tabs.label}
      className="grid grid-cols-2 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800"
    >
      {LOAN_KINDS.map((kind) => {
        const selected = activeKind === kind;
        const labels = texts.forKind(kind);
        return (
          <button
            key={kind}
            type="button"
            role="tab"
            aria-selected={selected}
            className={
              selected
                ? "rounded-md bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                : "rounded-md px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400"
            }
            onClick={() => onChange(kind)}
          >
            {labels.tab} ({counts[kind]})
          </button>
        );
      })}
    </div>
  );
}
