import type { LoanInput } from "@/lib/loans/types";

export function normalizeLoanInput(input: LoanInput): LoanInput {
  return {
    name: input.name.trim(),
    photoDataUrl: input.photoDataUrl,
    loanedAt: input.loanedAt,
    borrowerName: input.borrowerName.trim(),
  };
}

export function assertValidLoanInput(input: LoanInput): void {
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
