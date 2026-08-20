import { isLoanKind, parseLoanKind } from "@/lib/loans/types";

describe("loan kind", () => {
  it("accepts loan and borrow", () => {
    expect(isLoanKind("loan")).toBe(true);
    expect(isLoanKind("borrow")).toBe(true);
  });

  it("rejects unknown values", () => {
    expect(isLoanKind("gift")).toBe(false);
    expect(isLoanKind(null)).toBe(false);
    expect(isLoanKind(undefined)).toBe(false);
  });

  it("defaults unknown values to loan", () => {
    expect(parseLoanKind("borrow")).toBe("borrow");
    expect(parseLoanKind("loan")).toBe("loan");
    expect(parseLoanKind(undefined)).toBe("loan");
    expect(parseLoanKind("other")).toBe("loan");
  });
});
