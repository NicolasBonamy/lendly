import { isLoanKind, type LoanInput } from "@/lib/loans/types";

export function normalizeLoanInput(input: LoanInput): LoanInput {
  return {
    kind: input.kind,
    name: input.name.trim(),
    photoDataUrl: input.photoDataUrl,
    loanedAt: input.loanedAt,
    borrowerName: input.borrowerName.trim(),
  };
}

export function assertValidLoanInput(input: LoanInput): void {
  if (!isLoanKind(input.kind)) {
    throw new Error("Loan kind must be loan or borrow");
  }
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
