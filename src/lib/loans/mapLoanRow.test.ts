import { mapLoanRow } from "@/lib/loans/mapLoanRow";
import type { LoanRow } from "@/lib/supabase/database";

function buildRow(overrides: Partial<LoanRow> = {}): LoanRow {
  return {
    id: "loan-1",
    user_id: "user-1",
    kind: "loan",
    name: "Drill",
    photo_path: "user-1/loan-1.jpg",
    loaned_at: "2026-08-18",
    borrower_name: "Alice",
    created_at: "2026-08-18T10:00:00.000Z",
    updated_at: "2026-08-18T10:00:00.000Z",
    ...overrides,
  };
}

describe("mapLoanRow", () => {
  it("maps a loan row including kind and signed photo URL", () => {
    expect(mapLoanRow(buildRow(), "https://signed.example/photo.jpg")).toEqual({
      id: "loan-1",
      kind: "loan",
      name: "Drill",
      photoUrl: "https://signed.example/photo.jpg",
      photoPath: "user-1/loan-1.jpg",
      loanedAt: "2026-08-18",
      borrowerName: "Alice",
      createdAt: "2026-08-18T10:00:00.000Z",
      updatedAt: "2026-08-18T10:00:00.000Z",
    });
  });

  it("maps a borrow row", () => {
    expect(mapLoanRow(buildRow({ kind: "borrow" }), null).kind).toBe("borrow");
  });

  it("defaults a missing kind to loan", () => {
    expect(
      mapLoanRow(buildRow({ kind: undefined as unknown as LoanRow["kind"] }), null)
        .kind,
    ).toBe("loan");
  });
});
