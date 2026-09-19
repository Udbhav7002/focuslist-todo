/**
 * @fileoverview Date helpers for due dates. All comparisons are done on
 * local calendar days using `YYYY-MM-DD` strings to avoid timezone bugs.
 * @module utils/date
 */

const DAY_MS = 86_400_000;

/** Today's date as a local `YYYY-MM-DD` string. */
export function todayISO(): string {
  return toISO(new Date());
}

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function utcFromISO(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y ?? 0, (m ?? 1) - 1, d ?? 1);
}

/** Whole-day difference between an ISO date and today (negative = past). */
export function dayDiffFromToday(iso: string): number {
  return Math.round((utcFromISO(iso) - utcFromISO(todayISO())) / DAY_MS);
}

/** Structural validation of a `YYYY-MM-DD` string. */
export function isValidISODate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(utcFromISO(value));
}

export type DueTone = 'overdue' | 'today' | 'soon' | 'future';

export interface DueInfo {
  text: string;
  tone: DueTone;
}

/**
 * Human-friendly due label, e.g. "Today", "Tomorrow", "Overdue by 3d",
 * weekday name, or "Sep 25" — plus a tone for badge coloring.
 */
export function dueInfo(dueDate: string | null): DueInfo | null {
  if (!dueDate) return null;
  const diff = dayDiffFromToday(dueDate);
  if (diff < 0) return { text: `Overdue by ${-diff}d`, tone: 'overdue' };
  if (diff === 0) return { text: 'Today', tone: 'today' };
  if (diff === 1) return { text: 'Tomorrow', tone: 'soon' };
  const date = new Date(utcFromISO(dueDate));
  if (diff <= 6) {
    return { text: date.toLocaleDateString(undefined, { weekday: 'short' }), tone: 'soon' };
  }
  return { text: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), tone: 'future' };
}

/** True when an incomplete task's due date is before today. */
export function isOverdue(dueDate: string | null, completed: boolean): boolean {
  return !completed && dueDate !== null && dayDiffFromToday(dueDate) < 0;
}
