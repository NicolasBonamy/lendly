import type { LoanInput } from "@/lib/loans/types";
import {
  assertValidLoanInput,
  normalizeLoanInput,
} from "@/lib/loans/validation";

function buildInput(overrides: Partial<LoanInput> = {}): LoanInput {
  return {
    kind: "loan",
    name: "Drill",
    photoDataUrl: "data:image/jpeg;base64,abc",
    loanedAt: "2026-08-18",
    borrowerName: "Alice",
    ...overrides,
  };
}

describe("loan validation", () => {
  it("trims name and borrower and keeps kind", () => {
    expect(
      normalizeLoanInput(
        buildInput({
          kind: "borrow",
          name: "  Hammer  ",
          borrowerName: "  Bob  ",
        }),
      ),
    ).toEqual({
      kind: "borrow",
      name: "Hammer",
      photoDataUrl: "data:image/jpeg;base64,abc",
      loanedAt: "2026-08-18",
      borrowerName: "Bob",
    });
  });

  it("rejects a loan without a name", () => {
    expect(() =>
      assertValidLoanInput(normalizeLoanInput(buildInput({ name: "   " }))),
    ).toThrow("Loan name is required");
  });

  it("rejects a loan without a borrower", () => {
    expect(() =>
      assertValidLoanInput(
        normalizeLoanInput(buildInput({ borrowerName: "   " })),
      ),
    ).toThrow("Borrower name is required");
  });

  it("rejects a loan with an invalid date", () => {
    expect(() =>
      assertValidLoanInput(buildInput({ loanedAt: "18/08/2026" })),
    ).toThrow("Loan date must use YYYY-MM-DD");
  });

  it("rejects an invalid kind", () => {
    expect(() =>
      assertValidLoanInput(buildInput({ kind: "gift" as LoanInput["kind"] })),
    ).toThrow("Loan kind must be loan or borrow");
  });

  it("accepts a valid loan", () => {
    expect(() => assertValidLoanInput(buildInput())).not.toThrow();
  });

  it("accepts a valid borrow", () => {
    expect(() =>
      assertValidLoanInput(buildInput({ kind: "borrow" })),
    ).not.toThrow();
  });
});
