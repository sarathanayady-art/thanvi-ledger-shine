const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Parse "DD Mon YY" → Date object */
export function parseEntryDate(dateStr: string): Date {
  const parts = dateStr.split(" ");
  if (parts.length !== 3) return new Date(0);
  const day = parseInt(parts[0]);
  const monthIdx = MONTHS.indexOf(parts[1]);
  const year = 2000 + parseInt(parts[2]);
  return new Date(year, monthIdx, day);
}

/** Format Date → "DD Mon YY" */
export function formatEntryDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
}

/** Sort comparator: latest date first */
export function sortByDateDesc<T extends { date: string }>(a: T, b: T): number {
  return parseEntryDate(b.date).getTime() - parseEntryDate(a.date).getTime();
}
