import { render, screen } from "@testing-library/react";
import { LoanCard } from "@/components/loans/LoanCard";
import type { Loan } from "@/lib/loans/types";
import { texts } from "@/lib/texts";

function buildLoan(overrides: Partial<Loan> = {}): Loan {
  return {
    id: "loan-1",
    kind: "loan",
    name: "Drill",
    photoUrl: null,
    photoPath: null,
    loanedAt: "2026-08-18",
    borrowerName: "Alice",
    createdAt: "2026-08-18T10:00:00.000Z",
    updatedAt: "2026-08-18T10:00:00.000Z",
    ...overrides,
  };
}

describe("LoanCard", () => {
  it("uses borrow labels for a borrow item", () => {
    render(
      <LoanCard
        loan={buildLoan({ kind: "borrow", borrowerName: "Bob" })}
        onEdit={() => undefined}
        onDelete={() => undefined}
      />,
    );

    expect(
      screen.getByText(`${texts.forKind("borrow").personLabel} :`),
    ).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });
});
