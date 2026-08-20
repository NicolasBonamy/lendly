import { fireEvent, render, screen } from "@testing-library/react";
import { LoanKindTabs } from "@/components/loans/LoanKindTabs";
import { texts } from "@/lib/texts";

describe("LoanKindTabs", () => {
  it("marks the active kind and reports counts", () => {
    const onChange = jest.fn();
    render(
      <LoanKindTabs
        activeKind="loan"
        counts={{ loan: 2, borrow: 1 }}
        onChange={onChange}
      />,
    );

    const loanTab = screen.getByRole("tab", {
      name: `${texts.forKind("loan").tab} (2)`,
    });
    const borrowTab = screen.getByRole("tab", {
      name: `${texts.forKind("borrow").tab} (1)`,
    });

    expect(loanTab).toHaveAttribute("aria-selected", "true");
    expect(borrowTab).toHaveAttribute("aria-selected", "false");

    fireEvent.click(borrowTab);
    expect(onChange).toHaveBeenCalledWith("borrow");
  });
});
