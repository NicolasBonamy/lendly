"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { texts } from "@/lib/texts";

const THEMES = ["light", "dark", "system"] as const;

function subscribe() {
  return () => {};
}

function ThemeIcon({ theme }: { theme: (typeof THEMES)[number] }) {
  const className = "h-4 w-4";

  if (theme === "light") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={className}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v1.5M12 19.5V21M4.93 4.93l1.06 1.06M18.01 18.01l1.06 1.06M3 12h1.5M19.5 12H21M4.93 19.07l1.06-1.06M18.01 5.99l1.06-1.06" />
      </svg>
    );
  }

  if (theme === "dark") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={className}
        aria-hidden="true"
      >
        <path d="M15.5 3.5A8.5 8.5 0 1 0 20.5 14.5 7 7 0 0 1 15.5 3.5Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const hasMounted = useSyncExternalStore(subscribe, () => true, () => false);
  const activeTheme = hasMounted ? (theme ?? "system") : "system";

  return (
    <div
      role="group"
      aria-label={texts.theme.label}
      className="inline-flex rounded-md border border-zinc-300 p-0.5 dark:border-zinc-700"
    >
      {THEMES.map((value) => {
        const isActive = activeTheme === value;
        return (
          <button
            key={value}
            type="button"
            aria-label={texts.theme[value]}
            aria-pressed={isActive}
            onClick={() => setTheme(value)}
            className={
              isActive
                ? "rounded-md bg-zinc-900 p-2 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "rounded-md p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }
          >
            <ThemeIcon theme={value} />
          </button>
        );
      })}
    </div>
  );
}
