export type Priority = 'High' | 'Medium' | 'Low';
export type StatusFilter = 'All' | 'Active' | 'Completed';
export type SortOption = 'manual' | 'priority' | 'dueDate' | 'created' | 'alphabetical';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  tags: string[];
  createdAt: number;
  order: number;
}

export interface NewTodoInput {
  priority: Priority;
  dueDate: string | null;
  tags: string[];
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
}

export interface HistoryEntry {
  description: string;
  inverse: () => void;
}
