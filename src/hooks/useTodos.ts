/**
 * @fileoverview Central state container for tasks: CRUD, undoable delete,
 * reordering, filtering, searching, sorting, statistics, tags, import.
 * Persisted to localStorage with schema migration on read.
 * @module hooks/useTodos
 */

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import type { Priority, SortOption, StatusFilter, Todo, TodoStats } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { sanitizeInput, isValidTaskTitle } from '../utils/sanitize';
import { createId, normalizeTodos } from '../utils/todo';
import { isOverdue } from '../utils/date';
import {
  FILTERS_STORAGE_KEY,
  PRIORITY_RANK,
  STORAGE_KEY,
} from '../utils/constants';

/** Persisted filter/sort state. */
export interface FilterState {
  search: string;
  status: StatusFilter;
  priority: 'All' | Priority;
  tag: string;
  sort: SortOption;
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  status: 'All',
  priority: 'All',
  tag: 'All',
  sort: 'manual',
};

/** A deleted task together with its original index (for precise undo). */
export interface DeletedEntry {
  todo: Todo;
  index: number;
}

export interface UseTodosReturn {
  /** Visible (filtered + sorted) tasks. */
  todos: Todo[];
  /** Complete unfiltered task list. */
  allTodos: Todo[];
  stats: TodoStats;
  /** Alphabetized, deduplicated tag list across all tasks. */
  allTags: string[];
  filters: FilterState;
  addTodo: (text: string, input: { priority: Priority; dueDate: string | null; tags: string[] }) => void;
  toggleTodo: (id: string) => void;
  /** Deletes a task and returns it with its index so callers can offer Undo. */
  deleteTodo: (id: string) => DeletedEntry | null;
  /** Restores a previously deleted task at its original index. */
  restoreTodo: (todo: Todo, index: number) => void;
  /** Deletes all completed tasks; returns them (with indexes) for Undo. */
  clearCompleted: () => DeletedEntry[];
  updateTodo: (
    id: string,
    patch: Partial<Pick<Todo, 'text' | 'priority' | 'dueDate' | 'tags'>>
  ) => void;
  /** Swaps a task with its order-neighbor (keyboard reorder). */
  moveTodo: (id: string, direction: -1 | 1) => void;
  /** Inserts `sourceId` at the position of `targetId` (drag & drop). */
  reorderTodos: (sourceId: string, targetId: string, position: 'above' | 'below') => void;
  /** Replaces the whole list with an imported, normalized list. */
  importTodos: (list: Todo[]) => void;
  setSearch: (v: string) => void;
  setStatus: (v: StatusFilter) => void;
  setPriority: (v: 'All' | Priority) => void;
  setTag: (v: string) => void;
  setSort: (v: SortOption) => void;
  resetFilters: () => void;
}

export function useTodos(): UseTodosReturn {
  const [allTodos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEY, [], normalizeTodos);

  const [filters, setFilters] = useLocalStorage<FilterState>(
    FILTERS_STORAGE_KEY,
    DEFAULT_FILTERS,
    (raw) =>
      typeof raw === 'object' && raw !== null
        ? { ...DEFAULT_FILTERS, ...(raw as Partial<FilterState>) }
        : DEFAULT_FILTERS
  );

  // Ref mirror so delete/clear can compute indexes without stale closures.
  const todosRef = useRef<Todo[]>(allTodos);
  useEffect(() => {
    todosRef.current = allTodos;
  }, [allTodos]);

  const deferredSearch = useDeferredValue(filters.search);

  /* ── CRUD ─────────────────────────────────────────────── */

  const addTodo = useCallback<UseTodosReturn['addTodo']>(
    (text, input) => {
      const sanitized = sanitizeInput(text);
      if (!isValidTaskTitle(sanitized)) return;
      const maxOrder = todosRef.current.reduce((m, t) => Math.max(m, t.order), -1);
      const newTodo: Todo = {
        id: createId(),
        text: sanitized,
        completed: false,
        priority: input.priority,
        dueDate: input.dueDate,
        tags: input.tags,
        createdAt: Date.now(),
        order: maxOrder + 1,
      };
      setTodos((prev) => [...prev, newTodo]);
    },
    [setTodos]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    },
    [setTodos]
  );

  const deleteTodo = useCallback(
    (id: string): DeletedEntry | null => {
      const current = todosRef.current;
      const index = current.findIndex((t) => t.id === id);
      if (index === -1) return null;
      const entry: DeletedEntry = { todo: current[index] as Todo, index };
      setTodos((prev) => prev.filter((t) => t.id !== id));
      return entry;
    },
    [setTodos]
  );

  const restoreTodo = useCallback(
    (todo: Todo, index: number) => {
      setTodos((prev) => {
        const next = [...prev];
        next.splice(Math.min(index, next.length), 0, todo);
        return next.map((t, i) => ({ ...t, order: i }));
      });
    },
    [setTodos]
  );

  const clearCompleted = useCallback((): DeletedEntry[] => {
    const current = todosRef.current;
    const entries: DeletedEntry[] = current
      .map((todo, index) => ({ todo, index }))
      .filter((e) => e.todo.completed);
    if (entries.length === 0) return [];
    setTodos((prev) => prev.filter((t) => !t.completed));
    return entries;
  }, [setTodos]);

  const updateTodo = useCallback<UseTodosReturn['updateTodo']>(
    (id, patch) => {
      const cleaned: typeof patch = { ...patch };
      if (typeof cleaned.text === 'string') {
        const sanitized = sanitizeInput(cleaned.text);
        if (!isValidTaskTitle(sanitized)) return;
        cleaned.text = sanitized;
      }
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...cleaned } : t)));
    },
    [setTodos]
  );

  /* ── Ordering ─────────────────────────────────────────── */

  const moveTodo = useCallback(
    (id: string, direction: -1 | 1) => {
      setTodos((prev) => {
        const sorted = [...prev].sort((a, b) => a.order - b.order);
        const index = sorted.findIndex((t) => t.id === id);
        const neighbor = sorted[index + direction];
        const self = sorted[index];
        if (index === -1 || !self || !neighbor) return prev;
        return prev.map((t) =>
          t.id === self.id
            ? { ...t, order: neighbor.order }
            : t.id === neighbor.id
              ? { ...t, order: self.order }
            : t
        );
      });
    },
    [setTodos]
  );

  const reorderTodos = useCallback<UseTodosReturn['reorderTodos']>(
    (sourceId, targetId, position) => {
      if (sourceId === targetId) return;
      setTodos((prev) => {
        const sorted = [...prev].sort((a, b) => a.order - b.order);
        const sourceTodo = sorted.find((t) => t.id === sourceId);
        if (!sourceTodo) return prev;
        
        const withoutSource = sorted.filter((t) => t.id !== sourceId);
        let targetIndex = withoutSource.findIndex((t) => t.id === targetId);
        if (targetIndex === -1) return prev;
        
        if (position === 'below') targetIndex += 1;
        
        withoutSource.splice(targetIndex, 0, sourceTodo);
        return withoutSource.map((t, i) => ({ ...t, order: i }));
      });
    },
    [setTodos]
  );

  const importTodos = useCallback(
    (list: Todo[]) => {
      setTodos(list.map((t, i) => ({ ...t, order: i })));
    },
    [setTodos]
  );

  /* ── Filter setters ───────────────────────────────────── */

  const setSearch = useCallback((v: string) => setFilters((p) => ({ ...p, search: v })), [setFilters]);
  const setStatus = useCallback((v: StatusFilter) => setFilters((p) => ({ ...p, status: v })), [setFilters]);
  const setPriority = useCallback((v: 'All' | Priority) => setFilters((p) => ({ ...p, priority: v })), [setFilters]);
  const setTag = useCallback((v: string) => setFilters((p) => ({ ...p, tag: v })), [setFilters]);
  const setSort = useCallback((v: SortOption) => setFilters((p) => ({ ...p, sort: v })), [setFilters]);
  const resetFilters = useCallback(() => setFilters({ ...DEFAULT_FILTERS, sort: filters.sort }), [setFilters, filters.sort]);

  /* ── Derived state ────────────────────────────────────── */

  const visible = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    return allTodos.filter((t) => {
      if (q && !t.text.toLowerCase().includes(q)) return false;
      if (filters.status === 'Active' && t.completed) return false;
      if (filters.status === 'Completed' && !t.completed) return false;
      if (filters.priority !== 'All' && t.priority !== filters.priority) return false;
      if (filters.tag !== 'All' && !t.tags.includes(filters.tag)) return false;
      return true;
    });
  }, [allTodos, deferredSearch, filters.status, filters.priority, filters.tag]);

  const todos = useMemo(() => {
    const arr = [...visible];
    switch (filters.sort) {
      case 'priority':
        arr.sort(
          (a, b) =>
            PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
            a.createdAt - b.createdAt
        );
        break;
      case 'dueDate':
        arr.sort(
          (a, b) =>
            (a.dueDate ?? '9999-12-31').localeCompare(b.dueDate ?? '9999-12-31') ||
            a.order - b.order
        );
        break;
      case 'created':
        arr.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'alphabetical':
        arr.sort((a, b) => a.text.localeCompare(b.text));
        break;
      default:
        arr.sort((a, b) => a.order - b.order);
    }
    return arr;
  }, [visible, filters.sort]);

  const stats: TodoStats = useMemo(
    () => ({
      total: allTodos.length,
      completed: allTodos.filter((t) => t.completed).length,
      pending: allTodos.filter((t) => !t.completed).length,
      overdue: allTodos.filter((t) => isOverdue(t.dueDate, t.completed)).length,
    }),
    [allTodos]
  );

  const allTags = useMemo(
    () => [...new Set(allTodos.flatMap((t) => t.tags))].sort((a, b) => a.localeCompare(b)),
    [allTodos]
  );

  return {
    todos,
    allTodos,
    stats,
    allTags,
    filters,
    addTodo,
    toggleTodo,
    deleteTodo,
    restoreTodo,
    clearCompleted,
    updateTodo,
    moveTodo,
    reorderTodos,
    importTodos,
    setSearch,
    setStatus,
    setPriority,
    setTag,
    setSort,
    resetFilters,
  };
}
