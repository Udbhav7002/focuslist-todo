/**
 * @fileoverview Core type definitions for the FocusList To-Do application.
 * @module types
 */

/**
 * Represents the priority level of a task.
 * Tasks can be categorized as High, Medium, or Low priority.
 */
export type Priority = 'High' | 'Medium' | 'Low';

/**
 * Represents the filter status for viewing tasks.
 * - 'All': Show all tasks regardless of completion status.
 * - 'Active': Show only incomplete tasks.
 * - 'Completed': Show only completed tasks.
 */
export type StatusFilter = 'All' | 'Active' | 'Completed';

/**
 * Represents a single to-do task in the application.
 * Each task has a unique identifier, text content, completion state,
 * priority level, and creation timestamp.
 */
export interface Todo {
  /** Unique identifier for the task, generated via crypto.randomUUID(). */
  id: string;
  /** The title/description text of the task. */
  text: string;
  /** Whether the task has been marked as completed. */
  completed: boolean;
  /** The priority level assigned to the task. */
  priority: Priority;
  /** Unix timestamp (ms) of when the task was created. */
  createdAt: number;
}

/**
 * Aggregated statistics about the current task list.
 * These values update reactively when task data changes.
 */
export interface TodoStats {
  /** Total number of tasks in the list. */
  total: number;
  /** Number of tasks marked as completed. */
  completed: number;
  /** Number of tasks that are still pending (not completed). */
  pending: number;
}
