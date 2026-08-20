export const LOAN_KINDS = ["loan", "borrow"] as const;

export type LoanKind = (typeof LOAN_KINDS)[number];

export type Loan = {
  id: string;
  kind: LoanKind;
  name: string;
  photoUrl: string | null;
  photoPath: string | null;
  loanedAt: string;
  borrowerName: string;
  createdAt: string;
  updatedAt: string;
};

export type LoanInput = {
  kind: LoanKind;
  name: string;
  photoDataUrl: string | null;
  loanedAt: string;
  borrowerName: string;
};

export function isLoanKind(value: unknown): value is LoanKind {
  return value === "loan" || value === "borrow";
}

export function parseLoanKind(value: unknown): LoanKind {
  return isLoanKind(value) ? value : "loan";
}
