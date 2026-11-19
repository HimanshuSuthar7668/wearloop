import type { Product } from "@/types";

export type Duration = 1 | 3 | 7;

export const DURATIONS: { days: Duration; label: string; key: keyof Product["rentalPrice"] }[] = [
  { days: 1, label: "1 day", key: "perDay" },
  { days: 3, label: "3 days", key: "per3Days" },
  { days: 7, label: "7 days", key: "perWeek" },
];

export function priceFor(product: Product, days: number) {
  const d = DURATIONS.find((x) => x.days === days) ?? DURATIONS[1];
  return product.rentalPrice[d.key];
}

/** YYYY-MM-DD in the visitor's local time zone (not UTC, so dates don't shift at night). */
export function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromISODate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, n: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + n);
  return copy;
}

/** We deliver the day before a rental starts, so the earliest start is the day after tomorrow. */
export function earliestStart(today = new Date()) {
  return addDays(today, 2);
}

/** Bookings open up to 60 days ahead. */
export function latestStart(today = new Date()) {
  return addDays(today, 60);
}

export function rentalSchedule(startISO: string, days: number) {
  const start = fromISODate(startISO);
  return {
    deliver: addDays(start, -1),
    start,
    lastDay: addDays(start, days - 1),
    collect: addDays(start, days),
  };
}

const fmt = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" });
/** e.g. "Thu, 12 Nov" */
export function shortDate(date: Date) {
  return fmt.format(date);
}
