"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { fr } from "react-day-picker/locale";
import {
  formatLoanDate,
  parseIsoDate,
  toIsoDate,
  todayIsoDate,
} from "@/lib/loans/dates";
import { texts } from "@/lib/texts";

type DatePickerProps = {
  id?: string;
  value: string;
  onChange: (isoDate: string) => void;
};

export function DatePicker({ id, value, onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = parseIsoDate(value);
  const today = parseIsoDate(todayIsoDate());

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleDocumentClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef}>
      <button
        type="button"
        id={id}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={texts.datePicker.chooseDate}
        onClick={() => setIsOpen((open) => !open)}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-left text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
      >
        {formatLoanDate(value)}
      </button>
      {isOpen ? (
        <div className="mt-2 w-fit max-w-full overflow-x-auto rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          <DayPicker
            mode="single"
            locale={fr}
            weekStartsOn={1}
            className="text-zinc-900 dark:text-zinc-50"
            selected={selected}
            defaultMonth={selected}
            endMonth={today}
            disabled={today ? { after: today } : undefined}
            onSelect={(date) => {
              if (!date) {
                return;
              }
              const isoDate = toIsoDate(date);
              if (isoDate > todayIsoDate()) {
                return;
              }
              onChange(isoDate);
              setIsOpen(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
