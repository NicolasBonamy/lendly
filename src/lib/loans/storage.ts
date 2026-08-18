import type { Loan, LoanInput } from "@/lib/loans/types";

export const LOANS_STORAGE_KEY = "lendly.loans";
const LOANS_CHANGE_EVENT = "lendly-loans-changed";

function nowIso(): string {
  return new Date().toISOString();
}

function readLoans(): Loan[] {
  if (typeof window === "undefined") {
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
    return parsed as Loan[];
  } catch {
    return [];
  }
}

function writeLoans(loans: Loan[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOANS_STORAGE_KEY, JSON.stringify(loans));
  window.dispatchEvent(new Event(LOANS_CHANGE_EVENT));
}

function normalizeInput(input: LoanInput): LoanInput {
  return {
    name: input.name.trim(),
    photoDataUrl: input.photoDataUrl,
    loanedAt: input.loanedAt,
    borrowerName: input.borrowerName.trim(),
  };
}

function assertValidInput(input: LoanInput): void {
  if (!input.name) {
    throw new Error("Loan name is required");
  }
  if (!input.borrowerName) {
    throw new Error("Borrower name is required");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.loanedAt)) {
    throw new Error("Loan date must use YYYY-MM-DD");
  }
}

export function subscribeLoans(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(LOANS_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(LOANS_CHANGE_EVENT, onStoreChange);
  };
}

export function getLoansSnapshot(): string {
  if (typeof window === "undefined") {
    return "[]";
  }

  return window.localStorage.getItem(LOANS_STORAGE_KEY) ?? "[]";
}

export function getLoansServerSnapshot(): string {
  return "[]";
}

export function parseLoansSnapshot(raw: string): Loan[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return [...(parsed as Loan[])].sort((left, right) => {
      if (left.loanedAt === right.loanedAt) {
        return right.createdAt.localeCompare(left.createdAt);
      }
      return right.loanedAt.localeCompare(left.loanedAt);
    });
  } catch {
    return [];
  }
}

export function listLoans(): Loan[] {
  return parseLoansSnapshot(getLoansSnapshot());
}

export function getLoan(id: string): Loan | undefined {
  return readLoans().find((loan) => loan.id === id);
}

export function addLoan(input: LoanInput): Loan {
  const normalized = normalizeInput(input);
  assertValidInput(normalized);

  const timestamp = nowIso();
  const loan: Loan = {
    id: crypto.randomUUID(),
    ...normalized,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  writeLoans([...readLoans(), loan]);
  return loan;
}

export function updateLoan(id: string, input: LoanInput): Loan {
  const loans = readLoans();
  const index = loans.findIndex((loan) => loan.id === id);
  if (index === -1) {
    throw new Error(`Loan not found: ${id}`);
  }

  const normalized = normalizeInput(input);
  assertValidInput(normalized);

  const updated: Loan = {
    ...loans[index],
    ...normalized,
    updatedAt: nowIso(),
  };

  const nextLoans = [...loans];
  nextLoans[index] = updated;
  writeLoans(nextLoans);
  return updated;
}

export function deleteLoan(id: string): void {
  const loans = readLoans();
  const nextLoans = loans.filter((loan) => loan.id !== id);
  if (nextLoans.length === loans.length) {
    throw new Error(`Loan not found: ${id}`);
  }
  writeLoans(nextLoans);
}
