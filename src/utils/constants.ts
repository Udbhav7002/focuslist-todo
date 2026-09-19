/**
 * @fileoverview Application-wide constants for the FocusList To-Do application.
 * @module utils/constants
 */

import { Priority, StatusFilter, SortOption } from '../types';

export const STORAGE_KEY = 'focuslist-todos' as const;
export const THEME_STORAGE_KEY = 'focuslist-theme' as const;

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
  { label: 'Newest First', value: 'date' },
  { label: 'By Priority', value: 'priority' },
  { label: 'Alphabetical', value: 'alphabetical' },
] as const;

export const PRIORITY_COLORS: Record<Priority, string> = {
  High: 'text-red-700 bg-red-100 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700',
  Medium: 'text-amber-700 bg-amber-100 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700',
  Low: 'text-blue-700 bg-blue-100 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700',
} as const;

export const KEYBOARD_SHORTCUTS = {
  NEW_TASK: 'n',
  SEARCH: '/',
  TOGGLE_THEME: 'd',
} as const;

export const MAX_TASK_LENGTH = 200 as const;
