import { render, screen } from "@testing-library/react";
import { LoanForm } from "@/components/loans/LoanForm";
import { texts } from "@/lib/texts";

describe("LoanForm", () => {
  it("shows loan labels when creating a loan", () => {
    render(
      <LoanForm
        kind="loan"
        onSubmit={() => undefined}
        onCancel={() => undefined}
      />,
    );

    expect(
      screen.getByRole("heading", { name: texts.forKind("loan").add }),
    ).toBeInTheDocument();
    expect(screen.getByText(texts.forKind("loan").dateLabel)).toBeInTheDocument();
    expect(
      screen.getByText(texts.forKind("loan").personLabel),
    ).toBeInTheDocument();
  });

  it("shows borrow labels when creating a borrow", () => {
    render(
      <LoanForm
        kind="borrow"
        onSubmit={() => undefined}
        onCancel={() => undefined}
      />,
    );

    expect(
      screen.getByRole("heading", { name: texts.forKind("borrow").add }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(texts.forKind("borrow").dateLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByText(texts.forKind("borrow").personLabel),
    ).toBeInTheDocument();
  });

  it("offers a file picker and a camera control hidden on desktop", () => {
    render(
      <LoanForm
        kind="loan"
        onSubmit={() => undefined}
        onCancel={() => undefined}
      />,
    );

    expect(
      screen.getByText(texts.form.chooseFile),
    ).toBeInTheDocument();

    const takePhoto = screen.getByText(texts.form.takePhoto);
    expect(takePhoto).toHaveClass("xl:hidden");

    const cameraInput = document.getElementById(
      takePhoto.getAttribute("for") ?? "",
    ) as HTMLInputElement | null;
    expect(cameraInput).not.toBeNull();
    expect(cameraInput).toHaveAttribute("capture", "environment");
    expect(cameraInput).toHaveAttribute("accept", "image/*");
    expect(cameraInput?.className).toContain("xl:hidden");
  });
});
