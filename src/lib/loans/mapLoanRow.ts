import { parseLoanKind, type Loan } from "@/lib/loans/types";
import type { LoanRow } from "@/lib/supabase/database";

export function mapLoanRow(row: LoanRow, photoUrl: string | null): Loan {
  return {
    id: row.id,
    kind: parseLoanKind(row.kind),
    name: row.name,
    photoUrl,
    photoPath: row.photo_path,
    loanedAt: row.loaned_at,
    borrowerName: row.borrower_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
