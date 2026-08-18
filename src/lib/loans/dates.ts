export function parseIsoDate(isoDate: string): Date | undefined {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatLoanDate(isoDate: string): string {
  const date = parseIsoDate(isoDate);
  if (!date) {
    return isoDate;
  }

  return date.toLocaleDateString("fr-FR");
}

export function todayIsoDate(): string {
  return toIsoDate(new Date());
}
