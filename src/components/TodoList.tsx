/**
 * @fileoverview TodoList component for the FocusList To-Do application.
 * Acts as a container for rendering the filtered list of TodoItem components
 * or an EmptyState when no tasks match the current criteria.
 * @module components/TodoList
 */

import React from 'react';
import { TodoItem } from './TodoItem';
import { EmptyState } from './EmptyState';
import type { Todo } from '../types';

/**
 * Props for the TodoList component.
 */
interface TodoListProps {
  /** The filtered array of todos to display. */
  todos: Todo[];
  /** Whether any search or filter criteria are currently active. */
  hasFilters: boolean;
  /** Callback to toggle a task's completion status. */
  onToggle: (id: string) => void;
  /** Callback to delete a task. */
  onDelete: (id: string) => void;
  /** Callback to edit a task's title. */
  onEdit: (id: string, newText: string) => void;
}

/**
 * Renders the task list or an empty state placeholder.
 * Uses an ARIA live region so assistive technologies announce list changes.
 *
 * @param {TodoListProps} props - Component props.
 * @returns {React.ReactElement} The rendered task list or empty state.
 */
export const TodoList: React.FC<TodoListProps> = React.memo(function TodoList({
  todos,
  hasFilters,
  onToggle,
  onDelete,
  onEdit,
}) {
  return (
    <section aria-label="Task list" data-testid="todo-list">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {todos.length} {todos.length === 1 ? 'task' : 'tasks'} displayed
      </div>

      {todos.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <ul className="space-y-3" role="list" data-testid="task-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </ul>
      )}
    </section>
  );
});
