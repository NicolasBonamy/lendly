import {
  addLoan,
  deleteLoan,
  getLoan,
  listLoans,
  LOANS_STORAGE_KEY,
  updateLoan,
} from "@/lib/loans/storage";
import type { LoanInput } from "@/lib/loans/types";

function buildInput(overrides: Partial<LoanInput> = {}): LoanInput {
  return {
    name: "Drill",
    photoDataUrl: "data:image/jpeg;base64,abc",
    loanedAt: "2026-08-18",
    borrowerName: "Alice",
    ...overrides,
  };
}

describe("loan storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("lists an empty collection by default", () => {
    expect(listLoans()).toEqual([]);
  });

  it("adds a loan and lists it", () => {
    const created = addLoan(buildInput());

    expect(created.id).toBeTruthy();
    expect(created.name).toBe("Drill");
    expect(created.borrowerName).toBe("Alice");
    expect(created.loanedAt).toBe("2026-08-18");
    expect(created.photoDataUrl).toBe("data:image/jpeg;base64,abc");
    expect(created.createdAt).toBe(created.updatedAt);
    expect(listLoans()).toEqual([created]);
    expect(window.localStorage.getItem(LOANS_STORAGE_KEY)).toContain(created.id);
  });

  it("trims name and borrower before saving", () => {
    const created = addLoan(
      buildInput({ name: "  Hammer  ", borrowerName: "  Bob  " }),
    );

    expect(created.name).toBe("Hammer");
    expect(created.borrowerName).toBe("Bob");
  });

  it("rejects a loan without a name", () => {
    expect(() => addLoan(buildInput({ name: "   " }))).toThrow(
      "Loan name is required",
    );
    expect(listLoans()).toEqual([]);
  });

  it("updates an existing loan", () => {
    const created = addLoan(buildInput());

    const updated = updateLoan(
      created.id,
      buildInput({
        name: "Impact driver",
        borrowerName: "Charlie",
        loanedAt: "2026-08-01",
        photoDataUrl: null,
      }),
    );

    expect(updated.id).toBe(created.id);
    expect(updated.name).toBe("Impact driver");
    expect(updated.borrowerName).toBe("Charlie");
    expect(updated.loanedAt).toBe("2026-08-01");
    expect(updated.photoDataUrl).toBeNull();
    expect(updated.createdAt).toBe(created.createdAt);
    expect(updated.updatedAt >= created.updatedAt).toBe(true);
    expect(getLoan(created.id)).toEqual(updated);
    expect(listLoans()).toHaveLength(1);
  });

  it("throws when updating a missing loan", () => {
    expect(() =>
      updateLoan("missing-id", buildInput()),
    ).toThrow("Loan not found: missing-id");
  });

  it("deletes a loan", () => {
    const kept = addLoan(buildInput({ name: "Kept tool" }));
    const removed = addLoan(buildInput({ name: "Removed tool" }));

    deleteLoan(removed.id);

    expect(listLoans().map((loan) => loan.id)).toEqual([kept.id]);
    expect(getLoan(removed.id)).toBeUndefined();
  });

  it("throws when deleting a missing loan", () => {
    expect(() => deleteLoan("missing-id")).toThrow(
      "Loan not found: missing-id",
    );
  });

  it("sorts loans by loan date descending", () => {
    addLoan(buildInput({ name: "Older", loanedAt: "2026-01-01" }));
    addLoan(buildInput({ name: "Newer", loanedAt: "2026-08-01" }));

    expect(listLoans().map((loan) => loan.name)).toEqual(["Newer", "Older"]);
  });
});
