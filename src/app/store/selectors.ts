import type { Todo, TodoStats } from '../../entities/todo/model/types';
import { isOverdue } from '../../entities/todo/lib/dateUtils';
import { PRIORITY_RANK } from '../../entities/todo/model/constants';

export const selectVisibleTodos = (state: {
  todos: Todo[];
  search: string;
  statusFilter: string;
  priorityFilter: string;
  tagFilter: string;
  sortOption: string;
}): Todo[] => {
  const query = state.search.trim().toLowerCase();

  const filtered = state.todos.filter((t) => {
    if (query && !t.text.toLowerCase().includes(query)) return false;
    if (state.statusFilter === 'Active' && t.completed) return false;
    if (state.statusFilter === 'Completed' && !t.completed) return false;
    if (state.priorityFilter !== 'All' && t.priority !== state.priorityFilter) return false;
    if (state.tagFilter !== 'All' && !t.tags.includes(state.tagFilter)) return false;
    return true;
  });

  const sorted = [...filtered];

  switch (state.sortOption) {
    case 'priority':
      sorted.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || a.createdAt - b.createdAt);
      break;
    case 'dueDate':
      sorted.sort((a, b) => (a.dueDate ?? '9999-12-31').localeCompare(b.dueDate ?? '9999-12-31') || a.order - b.order);
      break;
    case 'created':
      sorted.sort((a, b) => b.createdAt - a.createdAt);
      break;
    case 'alphabetical':
      sorted.sort((a, b) => a.text.localeCompare(b.text));
      break;
    case 'manual':
    default:
      sorted.sort((a, b) => a.order - b.order);
      break;
  }
  return sorted;
};

export const selectTodoStats = (state: { todos: Todo[] }): TodoStats => {
  const total = state.todos.length;
  const completed = state.todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const overdue = state.todos.filter((t) => isOverdue(t.dueDate, t.completed)).length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, pending, overdue, completionRate };
};

export const selectAvailableTags = (state: { todos: Todo[] }): string[] => {
  const tagSet = new Set<string>();
  state.todos.forEach((t) => t.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
};
