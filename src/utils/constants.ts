/**
 * @fileoverview Application-wide constants for the FocusList To-Do application.
 * Centralizes magic strings and configuration values to improve maintainability.
 * @module utils/constants
 */

import { Priority, StatusFilter } from '../types';

/** LocalStorage key used for persisting task data across page refreshes. */
export const STORAGE_KEY = 'focuslist-todos' as const;

/** LocalStorage key used for persisting the user's theme preference. */
export const THEME_STORAGE_KEY = 'focuslist-theme' as const;

/**
 * Available priority options for task creation and filtering.
 * Each option includes a label for display and a value for data binding.
 */
export const PRIORITY_OPTIONS: readonly { label: string; value: Priority }[] = [
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' },
] as const;

/**
 * Available status filter options for the task list view.
 * Each option includes a label for display and a value for data binding.
 */
export const STATUS_FILTER_OPTIONS: readonly { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Completed', value: 'Completed' },
] as const;

/**
 * Mapping of priority levels to their corresponding Tailwind CSS classes.
 * Used for visually distinguishing task priority via colored badges.
 */
export const PRIORITY_COLORS: Record<Priority, string> = {
  High: 'text-red-700 bg-red-100 border-red-200',
  Medium: 'text-amber-700 bg-amber-100 border-amber-200',
  Low: 'text-blue-700 bg-blue-100 border-blue-200',
} as const;

/**
 * Keyboard shortcut definitions used throughout the application.
 * Provides consistent key-binding references for accessibility and power users.
 */
export const KEYBOARD_SHORTCUTS = {
  /** Focus the new task input field. */
  NEW_TASK: 'n',
  /** Focus the search input field. */
  SEARCH: '/',
  /** Toggle dark mode theme. */
  TOGGLE_THEME: 'd',
} as const;

/** Maximum allowed character length for a task title. */
export const MAX_TASK_LENGTH = 200 as const;
