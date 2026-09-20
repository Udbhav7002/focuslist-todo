import type { Priority, Todo } from '../model/types';
import { isValidISODate } from './dateUtils';

const PRIORITIES: readonly Priority[] = ['High', 'Medium', 'Low'];

export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeTodo(raw: unknown, index: number): Todo | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.text !== 'string' || r.text.trim().length === 0) return null;
  const rawTags = Array.isArray(r.tags) ? (r.tags as unknown[]) : [];
  return {
    id: typeof r.id === 'string' && r.id.length > 0 ? r.id : createId(),
    text: r.text,
    completed: r.completed === true,
    priority: PRIORITIES.includes(r.priority as Priority) ? (r.priority as Priority) : 'Medium',
    dueDate: typeof r.dueDate === 'string' && isValidISODate(r.dueDate) ? r.dueDate : null,
    tags: rawTags.filter((t): t is string => typeof t === 'string').slice(0, 5),
    createdAt: typeof r.createdAt === 'number' ? r.createdAt : Date.now(),
    order: typeof r.order === 'number' ? r.order : index,
  };
}

export function normalizeTodos(raw: unknown): Todo[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((t, i) => normalizeTodo(t, i))
    .filter((t): t is Todo => t !== null)
    .map((t, i) => ({ ...t, order: i }));
}

export function truncate(text: string, max = 32): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
