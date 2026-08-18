import { parseIsoDate, toIsoDate } from "@/lib/loans/dates";

describe("loan dates", () => {
  it("parses an ISO date as a local calendar day", () => {
    const date = parseIsoDate("2026-08-18");

    expect(date).toBeInstanceOf(Date);
    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(7);
    expect(date?.getDate()).toBe(18);
  });

  it("returns undefined for an invalid ISO date", () => {
    expect(parseIsoDate("not-a-date")).toBeUndefined();
  });

  it("formats a Date back to YYYY-MM-DD", () => {
    expect(toIsoDate(new Date(2026, 7, 18))).toBe("2026-08-18");
  });
});
