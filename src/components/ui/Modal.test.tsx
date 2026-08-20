import { render, screen } from "@testing-library/react";
import { Modal } from "@/components/ui/Modal";

describe("Modal", () => {
  it("renders a scrollable overlay so tall content stays reachable", () => {
    const { container } = render(
      <Modal labelledBy="dialog-title">
        <h2 id="dialog-title">Add a loan</h2>
      </Modal>,
    );

    const overlay = container.firstChild as HTMLElement;
    expect(overlay.className).toContain("overflow-y-auto");
    expect(overlay.className).toContain("overscroll-contain");
    expect(
      screen.getByRole("dialog", { name: "Add a loan" }),
    ).toBeInTheDocument();
  });
});
