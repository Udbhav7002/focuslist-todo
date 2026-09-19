/**
 * @fileoverview Core type definitions for the FocusList To-Do application.
 * @module types
 */

/** Priority level of a task. */
export type Priority = 'High' | 'Medium' | 'Low';

/** Completion-status filter for the task list. */
export type StatusFilter = 'All' | 'Active' | 'Completed';

/** Sort strategies for the visible task list. */
export type SortOption = 'manual' | 'priority' | 'dueDate' | 'created' | 'alphabetical';

/** A single to-do task. */
export interface Todo {
  /** Unique identifier (crypto.randomUUID with fallback). */
  id: string;
  /** Sanitized title text. */
  text: string;
  /** Completion state. */
  completed: boolean;
  /** Priority level. */
  priority: Priority;
  /** Due date as a local `YYYY-MM-DD` string, or null when unset. */
  dueDate: string | null;
  /** Up to MAX_TAGS labels for grouping/filtering. */
  tags: string[];
  /** Creation timestamp (ms). */
  createdAt: number;
  /** Position in the manual (drag) ordering. */
  order: number;
}

/** Input payload accepted by `addTodo`. */
export interface NewTodoInput {
  priority: Priority;
  dueDate: string | null;
  tags: string[];
}

/** Aggregated statistics over the complete (unfiltered) task list. */
export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  /** Pending tasks whose due date is in the past. */
  overdue: number;
}
