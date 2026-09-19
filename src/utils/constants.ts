/**
 * @fileoverview Application-wide constants.
 * @module utils/constants
 */

import type { Priority, StatusFilter, SortOption } from '../types';
import type { DueTone } from './date';

/** localStorage key for tasks (v2 schema). */
export const STORAGE_KEY = 'focuslist-todos-v2' as const;
/** localStorage key for the theme preference. */
export const THEME_STORAGE_KEY = 'focuslist-theme' as const;
/** localStorage key for persisted filter/sort state. */
export const FILTERS_STORAGE_KEY = 'focuslist-filters-v2' as const;

export const PRIORITY_OPTIONS: readonly { label: string; value: Priority }[] = [
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' },
] as const;

export const STATUS_FILTER_OPTIONS: readonly { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Completed', value: 'Completed' },
] as const;

export const SORT_OPTIONS: readonly { label: string; value: SortOption }[] = [
  { label: 'Manual (drag)', value: 'manual' },
  { label: 'Priority', value: 'priority' },
  { label: 'Due date', value: 'dueDate' },
  { label: 'Newest first', value: 'created' },
  { label: 'A – Z', value: 'alphabetical' },
] as const;

/** Priority badge colors (light + dark variants). */
export const PRIORITY_COLORS: Record<Priority, string> = {
  High: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/30',
  Medium:
    'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30',
  Low: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',
} as const;

/** Lower rank = higher priority. Used for sorting. */
export const PRIORITY_RANK: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 } as const;

/** Due-date badge colors keyed by urgency tone. */
export const DUE_TONE_COLORS: Record<DueTone, string> = {
  overdue: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/30',
  today: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30',
  soon: 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600',
  future: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',
} as const;

export const KEYBOARD_SHORTCUTS = {
  NEW_TASK: 'n',
  SEARCH: '/',
  TOGGLE_THEME: 'd',
  PALETTE: 'k',
  HELP: '?',
} as const;

export const MAX_TASK_LENGTH = 200 as const;
export const MAX_TAGS = 5 as const;
export const UNDO_TIMEOUT = 5000 as const;
