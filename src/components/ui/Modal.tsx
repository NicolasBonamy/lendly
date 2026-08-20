import type { ReactNode } from "react";

type ModalProps = {
  labelledBy: string;
  maxWidthClassName?: string;
  zClassName?: string;
  children: ReactNode;
};

export function Modal({
  labelledBy,
  maxWidthClassName = "max-w-md",
  zClassName = "z-10",
  children,
}: ModalProps) {
  return (
    <div
      className={`fixed inset-0 ${zClassName} overflow-y-auto overscroll-contain bg-black/40`}
    >
      <div className="flex min-h-full items-start justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          className={`my-auto w-full rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900 ${maxWidthClassName}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
