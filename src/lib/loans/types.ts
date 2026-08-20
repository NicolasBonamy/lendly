export type Loan = {
  id: string;
  name: string;
  photoUrl: string | null;
  photoPath: string | null;
  loanedAt: string;
  borrowerName: string;
  createdAt: string;
  updatedAt: string;
};

export type LoanInput = {
  name: string;
  photoDataUrl: string | null;
  loanedAt: string;
  borrowerName: string;
};
