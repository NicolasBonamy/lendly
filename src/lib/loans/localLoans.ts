export const LOANS_STORAGE_KEY = "lendly.loans";
export const LOANS_MIGRATED_KEY = "lendly.loans-migrated";

export type LocalLoan = {
  id: string;
  name: string;
  photoDataUrl: string | null;
  loanedAt: string;
  borrowerName: string;
  createdAt: string;
  updatedAt: string;
};

function isLocalLoan(value: unknown): value is LocalLoan {
  if (!value || typeof value !== "object") {
    return false;
  }
  const loan = value as Record<string, unknown>;
  return (
    typeof loan.id === "string" &&
    typeof loan.name === "string" &&
    (loan.photoDataUrl === null || typeof loan.photoDataUrl === "string") &&
    typeof loan.loanedAt === "string" &&
    typeof loan.borrowerName === "string"
  );
}

export function readPendingLocalLoans(): LocalLoan[] {
  if (typeof window === "undefined") {
    return [];
  }
  if (window.localStorage.getItem(LOANS_MIGRATED_KEY) === "1") {
    return [];
  }

  const raw = window.localStorage.getItem(LOANS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isLocalLoan);
  } catch {
    return [];
  }
}

export function dismissLocalLoansMigration(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(LOANS_MIGRATED_KEY, "1");
}

export function clearLocalLoansAfterImport(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(LOANS_STORAGE_KEY);
  window.localStorage.setItem(LOANS_MIGRATED_KEY, "1");
}
