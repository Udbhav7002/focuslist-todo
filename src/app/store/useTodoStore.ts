import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Todo, Priority, StatusFilter, SortOption, HistoryEntry } from '../../entities/todo/model/types';
import { sanitizeInput, isValidTaskTitle } from '../../entities/todo/lib/sanitize';
import { createId, normalizeTodos } from '../../entities/todo/lib/todoUtils';
import { STORAGE_KEY, FILTERS_STORAGE_KEY } from '../../entities/todo/model/constants';

interface TodoState {
  todos: Todo[];
  historyStack: HistoryEntry[];
  
  search: string;
  statusFilter: StatusFilter;
  priorityFilter: 'All' | Priority;
  tagFilter: string;
  sortOption: SortOption;
  
  addTodo: (text: string, meta: { priority: Priority; dueDate: string | null; tags: string[] }) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, patch: Partial<Pick<Todo, 'text' | 'priority' | 'dueDate' | 'tags'>>) => void;
  deleteTodo: (id: string) => void;
  clearCompleted: () => void;
  restoreTodo: (todo: Todo, originalOrder: number) => void;
  
  reorderTodos: (sourceId: string, targetId: string, position: 'above' | 'below') => void;
  moveTodoDelta: (id: string, direction: -1 | 1) => void;
  
  setSearch: (query: string) => void;
  setStatusFilter: (status: StatusFilter) => void;
  setPriorityFilter: (priority: 'All' | Priority) => void;
  setTagFilter: (tag: string) => void;
  setSortOption: (sort: SortOption) => void;
  resetFilters: () => void;
  
  undo: () => void;
  importTodos: (todos: Todo[]) => void;
  hydrate: () => void;
}

const loadPersistedTodos = (): Todo[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeTodos(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
};

const loadPersistedFilters = () => {
  try {
    const raw = localStorage.getItem(FILTERS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const useTodoStore = create<TodoState>()(
  subscribeWithSelector((set, get) => ({
    todos: [],
    historyStack: [],
    
    search: '',
    statusFilter: 'All',
    priorityFilter: 'All',
    tagFilter: 'All',
    sortOption: 'manual',

    hydrate: () => {
      const savedFilters = loadPersistedFilters();
      set({
        todos: loadPersistedTodos(),
        search: savedFilters?.search || '',
        statusFilter: savedFilters?.status || 'All',
        priorityFilter: savedFilters?.priority || 'All',
        tagFilter: savedFilters?.tag || 'All',
        sortOption: savedFilters?.sort || 'manual',
      });
    },

    addTodo: (text, { priority, dueDate, tags }) => {
      const sanitized = sanitizeInput(text);
      if (!isValidTaskTitle(sanitized)) return;

      const current = get().todos;
      const maxOrder = current.reduce((max, t) => Math.max(max, t.order), -1);
      const newTodo: Todo = {
        id: createId(),
        text: sanitized,
        completed: false,
        priority,
        dueDate,
        tags: tags.map((t) => t.trim()),
        createdAt: Date.now(),
        order: maxOrder + 1,
      };

      set((state) => ({
        todos: [...state.todos, newTodo],
        historyStack: [
          {
            description: `Added "${sanitized}"`,
            inverse: () => set((s) => ({ todos: s.todos.filter((t) => t.id !== newTodo.id) })),
          },
          ...state.historyStack.slice(0, 19),
        ],
      }));
    },

    toggleTodo: (id) => {
      const target = get().todos.find((t) => t.id === id);
      if (!target) return;

      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        historyStack: [
          {
            description: `Toggled "${target.text}"`,
            inverse: () =>
              set((s) => ({
                todos: s.todos.map((t) => (t.id === id ? { ...t, completed: target.completed } : t)),
              })),
          },
          ...state.historyStack.slice(0, 19),
        ],
      }));
    },

    updateTodo: (id, patch) => {
      const target = get().todos.find((t) => t.id === id);
      if (!target) return;

      const cleanedPatch = { ...patch };
      if (cleanedPatch.text !== undefined) {
        const sanitized = sanitizeInput(cleanedPatch.text);
        if (!isValidTaskTitle(sanitized)) return;
        cleanedPatch.text = sanitized;
      }

      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? { ...t, ...cleanedPatch } : t)),
      }));
    },

    deleteTodo: (id) => {
      const target = get().todos.find((t) => t.id === id);
      if (!target) return;

      set((state) => ({
        todos: state.todos.filter((t) => t.id !== id),
        historyStack: [
          {
            description: `Deleted "${target.text}"`,
            inverse: () => set((s) => ({ 
              todos: [...s.todos, target].sort((a, b) => a.order - b.order) 
            })),
          },
          ...state.historyStack.slice(0, 19),
        ],
      }));
    },

    clearCompleted: () => {
      const completed = get().todos.filter((t) => t.completed);
      if (completed.length === 0) return;

      set((state) => ({
        todos: state.todos.filter((t) => !t.completed),
        historyStack: [
          {
            description: `Cleared ${completed.length} tasks`,
            inverse: () => set((s) => ({ 
              todos: [...s.todos, ...completed].sort((a, b) => a.order - b.order) 
            })),
          },
          ...state.historyStack.slice(0, 19),
        ],
      }));
    },

    restoreTodo: (todo, originalOrder) => {
       set((state) => ({
          todos: [...state.todos, { ...todo, order: originalOrder }].sort((a, b) => a.order - b.order)
       }));
    },

    reorderTodos: (sourceId, targetId, position) => {
      if (sourceId === targetId) return;
      set((state) => {
        const sorted = [...state.todos].sort((a, b) => a.order - b.order);
        const sourceIndex = sorted.findIndex((t) => t.id === sourceId);
        const sourceItem = sorted[sourceIndex];
        if (!sourceItem) return state;

        const withoutSource = sorted.filter((t) => t.id !== sourceId);
        let targetIndex = withoutSource.findIndex((t) => t.id === targetId);
        if (targetIndex === -1) return state;

        if (position === 'below') targetIndex += 1;
        withoutSource.splice(targetIndex, 0, sourceItem);

        return {
          todos: withoutSource.map((t, index) => ({ ...t, order: index })),
        };
      });
    },

    moveTodoDelta: (id, direction) => {
      set((state) => {
        const sorted = [...state.todos].sort((a, b) => a.order - b.order);
        const index = sorted.findIndex((t) => t.id === id);
        const neighbor = sorted[index + direction];
        const current = sorted[index];
        if (!current || !neighbor) return state;

        return {
          todos: state.todos.map((t) =>
            t.id === current.id
              ? { ...t, order: neighbor.order }
              : t.id === neighbor.id
              ? { ...t, order: current.order }
              : t
          ),
        };
      });
    },

    setSearch: (search) => set({ search }),
    setStatusFilter: (statusFilter) => set({ statusFilter }),
    setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
    setTagFilter: (tagFilter) => set({ tagFilter }),
    setSortOption: (sortOption) => set({ sortOption }),
    resetFilters: () => set({ search: '', statusFilter: 'All', priorityFilter: 'All', tagFilter: 'All' }),

    undo: () => {
      const stack = get().historyStack;
      if (stack.length === 0) return;
      const [latest, ...remaining] = stack;
      latest?.inverse();
      set({ historyStack: remaining });
    },

    importTodos: (todos) => set({ todos: todos.map((t, idx) => ({ ...t, order: idx })) }),
  }))
);

let persistenceTimer: ReturnType<typeof setTimeout>;
useTodoStore.subscribe(
  (state) => state.todos,
  (todos) => {
    clearTimeout(persistenceTimer);
    persistenceTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      } catch (e) {
        console.error('Persistence failed', e);
      }
    }, 200);
  }
);

let filterPersistenceTimer: ReturnType<typeof setTimeout>;
useTodoStore.subscribe(
  (state) => ({ 
    search: state.search, 
    status: state.statusFilter, 
    priority: state.priorityFilter, 
    tag: state.tagFilter, 
    sort: state.sortOption 
  }),
  (filters) => {
    clearTimeout(filterPersistenceTimer);
    filterPersistenceTimer = setTimeout(() => {
      try {
        localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
      } catch (e) {
        console.error('Filter persistence failed', e);
      }
    }, 200);
  }
);
