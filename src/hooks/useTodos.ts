/**
 * @fileoverview Custom hook for managing the complete to-do task lifecycle.
 * @module hooks/useTodos
 */

import { useState, useMemo, useCallback } from 'react';
import { Todo, Priority, StatusFilter, TodoStats } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { sanitizeInput, isValidTaskTitle } from '../utils/sanitize';
import { STORAGE_KEY } from '../utils/constants';

export interface UseTodosReturn {
  todos: Todo[];
  stats: TodoStats;
  hasFilters: boolean;
  addTodo: (text: string, priority: Priority) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, newText: string) => void;
  clearCompleted: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  priorityFilter: 'All' | Priority;
  setPriorityFilter: (filter: 'All' | Priority) => void;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEY, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All');

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

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  }, [setTodos]);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, [setTodos]);

  const editTodo = useCallback((id: string, newText: string) => {
    const sanitizedText = sanitizeInput(newText);
    if (!isValidTaskTitle(sanitizedText)) return;

    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: sanitizedText } : todo))
    );
  }, [setTodos]);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, [setTodos]);

  const hasFilters = searchQuery !== '' || statusFilter !== 'All' || priorityFilter !== 'All';

  const processedTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'All' ? true : statusFilter === 'Active' ? !todo.completed : todo.completed;
      const matchesPriority = priorityFilter === 'All' ? true : todo.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [todos, searchQuery, statusFilter, priorityFilter]);

  const stats: TodoStats = useMemo(() => ({
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
  }), [todos]);

  return {
    todos: processedTodos,
    stats,
    hasFilters,
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
