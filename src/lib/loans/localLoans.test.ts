import {
  clearLocalLoansAfterImport,
  dismissLocalLoansMigration,
  LOANS_MIGRATED_KEY,
  LOANS_STORAGE_KEY,
  readPendingLocalLoans,
} from "@/lib/loans/localLoans";

const sampleLoan = {
  id: "loan-1",
  name: "Drill",
  photoDataUrl: "data:image/jpeg;base64,abc",
  loanedAt: "2026-08-18",
  borrowerName: "Alice",
  createdAt: "2026-08-18T10:00:00.000Z",
  updatedAt: "2026-08-18T10:00:00.000Z",
};

describe("local loans migration", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns an empty list when nothing is stored", () => {
    expect(readPendingLocalLoans()).toEqual([]);
  });

  it("reads valid loans still waiting to be imported", () => {
    window.localStorage.setItem(
      LOANS_STORAGE_KEY,
      JSON.stringify([sampleLoan, { invalid: true }]),
    );

    expect(readPendingLocalLoans()).toEqual([sampleLoan]);
  });

  it("ignores local loans after the user dismisses migration", () => {
    window.localStorage.setItem(LOANS_STORAGE_KEY, JSON.stringify([sampleLoan]));
    dismissLocalLoansMigration();

    expect(window.localStorage.getItem(LOANS_MIGRATED_KEY)).toBe("1");
    expect(readPendingLocalLoans()).toEqual([]);
  });

  it("clears stored loans after a successful import", () => {
    window.localStorage.setItem(LOANS_STORAGE_KEY, JSON.stringify([sampleLoan]));
    clearLocalLoansAfterImport();

    expect(window.localStorage.getItem(LOANS_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(LOANS_MIGRATED_KEY)).toBe("1");
    expect(readPendingLocalLoans()).toEqual([]);
  });
});
