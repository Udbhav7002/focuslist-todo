/**
 * @fileoverview Custom hook for managing the complete to-do task lifecycle.
 * Handles CRUD operations, filtering, searching, and statistics computation.
 * Uses the useLocalStorage hook for automatic data persistence.
 * @module hooks/useTodos
 */

import { useState, useMemo, useCallback } from 'react';
import { Todo, Priority, StatusFilter, TodoStats } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { sanitizeInput, isValidTaskTitle } from '../utils/sanitize';
import { STORAGE_KEY } from '../utils/constants';

/**
 * The return type of the useTodos hook, providing all state and actions
 * needed by the UI to render and manage the task list.
 */
export interface UseTodosReturn {
  /** The filtered list of todos based on current search and filter criteria. */
  todos: Todo[];
  /** Aggregated statistics for the complete (unfiltered) task list. */
  stats: TodoStats;
  /** Adds a new task with the given title and priority. */
  addTodo: (text: string, priority: Priority) => void;
  /** Toggles the completion status of a task by its ID. */
  toggleTodo: (id: string) => void;
  /** Permanently removes a task by its ID. */
  deleteTodo: (id: string) => void;
  /** Updates the title text of an existing task. */
  editTodo: (id: string, newText: string) => void;
  /** Removes all completed tasks from the list. */
  clearCompleted: () => void;
  /** The current search query string. */
  searchQuery: string;
  /** Sets the search query for filtering tasks by title. */
  setSearchQuery: (query: string) => void;
  /** The current status filter (All, Active, or Completed). */
  statusFilter: StatusFilter;
  /** Sets the status filter for the task list view. */
  setStatusFilter: (filter: StatusFilter) => void;
  /** The current priority filter (All, High, Medium, or Low). */
  priorityFilter: 'All' | Priority;
  /** Sets the priority filter for the task list view. */
  setPriorityFilter: (filter: 'All' | Priority) => void;
}

/**
 * Custom React hook that encapsulates all to-do task management logic.
 *
 * Features:
 * - CRUD operations (Create, Read, Update, Delete)
 * - LocalStorage persistence via useLocalStorage hook
 * - Real-time search filtering by task title
 * - Status filtering (All / Active / Completed)
 * - Priority filtering (All / High / Medium / Low)
 * - Computed statistics (total, completed, pending)
 * - Input sanitization for security
 * - Memoized computations for performance
 *
 * @returns {UseTodosReturn} An object containing task state, statistics, and action handlers.
 *
 * @example
 * ```tsx
 * function TaskManager() {
 *   const { todos, stats, addTodo, toggleTodo } = useTodos();
 *   return <div>{todos.map(t => <span key={t.id}>{t.text}</span>)}</div>;
 * }
 * ```
 */
export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEY, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All');

  /**
   * Adds a new task to the list after sanitizing the input text.
   * Does nothing if the sanitized text is empty.
   */
  const addTodo = useCallback((text: string, priority: Priority) => {
    const sanitizedText = sanitizeInput(text);
    if (!isValidTaskTitle(sanitizedText)) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: sanitizedText,
      completed: false,
      priority,
      createdAt: Date.now(),
    };
    setTodos((prev) => [...prev, newTodo]);
  }, [setTodos]);

  /** Toggles the completed status of a task identified by its unique ID. */
  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  }, [setTodos]);

  /** Permanently removes a task identified by its unique ID from the list. */
  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, [setTodos]);

  /** Updates the text of an existing task after sanitizing the new input. */
  const editTodo = useCallback((id: string, newText: string) => {
    const sanitizedText = sanitizeInput(newText);
    if (!isValidTaskTitle(sanitizedText)) return;

    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: sanitizedText } : todo))
    );
  }, [setTodos]);

  /** Removes all tasks that have been marked as completed. */
  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, [setTodos]);

  /**
   * Memoized filtered task list based on search query, status filter, and priority filter.
   * Only recomputes when the underlying data or filter criteria change.
   */
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'All'
          ? true
          : statusFilter === 'Active'
            ? !todo.completed
            : todo.completed;
      const matchesPriority = priorityFilter === 'All' ? true : todo.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [todos, searchQuery, statusFilter, priorityFilter]);

  /**
   * Memoized statistics computed from the complete (unfiltered) task list.
   * Provides total, completed, and pending counts.
   */
  const stats: TodoStats = useMemo(() => ({
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
  }), [todos]);

  return {
    todos: filteredTodos,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
  };
}
