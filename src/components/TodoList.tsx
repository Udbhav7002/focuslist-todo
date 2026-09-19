/**
 * @fileoverview TodoList component for the FocusList To-Do application.
 * @module components/TodoList
 */

import React from 'react';
import { TodoItem } from './TodoItem';
import { EmptyState } from './EmptyState';
import { useTodoContext } from '../context/TodoContext';

export const TodoList: React.FC = React.memo(function TodoList() {
  const { todos, hasFilters, toggleTodo, deleteTodo, editTodo } = useTodoContext();

  return (
    <section aria-label="Task list" data-testid="todo-list" className="space-y-3">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {todos.length} {todos.length === 1 ? 'task' : 'tasks'} displayed
      </div>

      {todos.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <ul role="list" data-testid="task-list" className="space-y-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))}
        </ul>
      )}
    </section>
  );
});
