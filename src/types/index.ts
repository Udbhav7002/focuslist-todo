/**
 * @fileoverview Core type definitions for the FocusList To-Do application.
 * @module types
 */

export type Priority = 'High' | 'Medium' | 'Low';
export type StatusFilter = 'All' | 'Active' | 'Completed';
export type SortOption = 'date' | 'priority' | 'alphabetical';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
}
