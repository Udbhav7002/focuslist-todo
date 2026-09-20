const DAY_MS = 86_400_000;

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

export function dayDiffFromToday(iso: string): number {
  return Math.round((utcFromISO(iso) - utcFromISO(todayISO())) / DAY_MS);
}

export function isValidISODate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(utcFromISO(value));
}

export type DueTone = 'overdue' | 'today' | 'soon' | 'future';

export interface DueInfo {
  text: string;
  tone: DueTone;
}

export function dueInfo(dueDate: string | null): DueInfo | null {
  if (!dueDate) return null;
  const diff = dayDiffFromToday(dueDate);
  if (diff < 0) return { text: `Overdue by ${-diff}d`, tone: 'overdue' };
  if (diff === 0) return { text: 'Today', tone: 'today' };
  if (diff === 1) return { text: 'Tomorrow', tone: 'soon' };
  const date = new Date(utcFromISO(dueDate));
  if (diff <= 6) {
    return { text: date.toLocaleDateString(undefined, { weekday: 'short', timeZone: 'UTC' }), tone: 'soon' };
  }
  return { text: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' }), tone: 'future' };
}

export function isOverdue(dueDate: string | null, completed: boolean): boolean {
  return !completed && dueDate !== null && dayDiffFromToday(dueDate) < 0;
}

export function formatRelativeDate(iso: string): string {
  const info = dueInfo(iso);
  return info ? info.text : iso;
}
