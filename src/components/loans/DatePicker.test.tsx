import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { DatePicker } from "@/components/loans/DatePicker";
import { texts } from "@/lib/texts";

function DatePickerWithCancel() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  if (!isModalOpen) {
    return <p>Modal closed</p>;
  }

  return (
    <div>
      <DatePicker value="2026-08-20" onChange={() => undefined} />
      <button type="button" onClick={() => setIsModalOpen(false)}>
        {texts.actions.cancel}
      </button>
    </div>
  );
}

describe("DatePicker", () => {
  it("lets a cancel button close the parent on the first click while open", () => {
    render(<DatePickerWithCancel />);

    fireEvent.click(
      screen.getByRole("button", { name: texts.datePicker.chooseDate }),
    );
    expect(
      screen.getByRole("button", { name: texts.datePicker.chooseDate }),
    ).toHaveAttribute("aria-expanded", "true");

    fireEvent.mouseDown(
      screen.getByRole("button", { name: texts.actions.cancel }),
    );
    fireEvent.click(screen.getByRole("button", { name: texts.actions.cancel }));

    expect(screen.getByText("Modal closed")).toBeInTheDocument();
  });
});
