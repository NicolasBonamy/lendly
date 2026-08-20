import { render, screen } from "@testing-library/react";
import { LoanSection } from "@/components/loans/LoanSection";
import { texts } from "@/lib/texts";

describe("LoanSection", () => {
  it("shows the borrow empty state and add action", () => {
    render(
      <LoanSection
        kind="borrow"
        items={[]}
        onAdd={() => undefined}
        onEdit={() => undefined}
        onDelete={() => undefined}
      />,
    );

    expect(
      screen.getByRole("heading", { name: texts.forKind("borrow").sectionTitle }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(texts.forKind("borrow").emptyTitle),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: texts.forKind("borrow").add }),
    ).toHaveLength(2);
  });
});
