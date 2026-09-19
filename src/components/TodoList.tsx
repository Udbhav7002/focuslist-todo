/**
 * @fileoverview Renders the filtered task list with:
 * - roving-tabindex + Arrow/Home/End keyboard navigation,
 * - drag & drop reordering (manual sort only),
 * - an ARIA live region announcing list size changes,
 * - a helpful EmptyState when there is nothing to show.
 * @module components/TodoList
 */

import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, ReactElement } from 'react';
import { TodoItem } from './TodoItem';
import { EmptyState } from './EmptyState';
import type { SortOption, Todo } from '../types';

export interface TodoListProps {
  todos: Todo[];
  hasFilters: boolean;
  sort: SortOption;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, patch: Partial<Pick<Todo, 'text' | 'priority' | 'dueDate' | 'tags'>>) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onReorder: (sourceId: string, targetId: string) => void;
  onCreateFirst: () => void;
  onClearFilters: () => void;
}

export const TodoList = memo(function TodoList({
  todos,
  hasFilters,
  sort,
  onToggle,
  onDelete,
  onEdit,
  onMove,
  onReorder,
  onCreateFirst,
  onClearFilters,
}: TodoListProps): ReactElement {
  const listRef = useRef<HTMLUListElement>(null);
  /** Roving-tabindex owner: id of the toggle button currently in the tab order. */
  const [activeId, setActiveId] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const reorderEnabled = sort === 'manual' && !hasFilters;

  // Keep the roving tabindex pointed at a row that actually exists.
  useEffect(() => {
    if (todos.length === 0) {
      setActiveId(null);
      return;
    }
    if (!todos.some((t) => t.id === activeId)) {
      const first = todos[0];
      setActiveId(first ? first.id : null);
    }
  }, [todos, activeId]);

  // Apply requested focus moves after React has flushed tabIndex changes.
  useLayoutEffect(() => {
    if (!focusRequest) return;
    const btn = listRef.current?.querySelector<HTMLButtonElement>(
      `[data-todo-id="${focusRequest}"] [data-todo-toggle]`
    );
    btn?.focus();
    setFocusRequest(null);
  }, [focusRequest]);

  const focusByOffset = useCallback(
    (offset: number | 'first' | 'last') => {
      if (todos.length === 0) return;
      const ids = todos.map((t) => t.id);
      const current = activeId ? ids.indexOf(activeId) : -1;
      let nextIndex: number;
      if (offset === 'first') nextIndex = 0;
      else if (offset === 'last') nextIndex = ids.length - 1;
      else nextIndex = Math.min(Math.max(current + offset, 0), ids.length - 1);
      const nextId = ids[nextIndex];
      if (nextId && nextId !== activeId) {
        setActiveId(nextId);
        setFocusRequest(nextId);
      }
    },
    [todos, activeId]
  );

  const handleListKeyDown = (e: ReactKeyboardEvent<HTMLUListElement>) => {
    // Only intercept navigation from the toggle buttons, never edit inputs.
    const target = e.target as HTMLElement;
    if (!target.closest('[data-todo-toggle]')) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusByOffset(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusByOffset(-1);
        break;
      case 'Home':
        e.preventDefault();
        focusByOffset('first');
        break;
      case 'End':
        e.preventDefault();
        focusByOffset('last');
        break;
    }
  };

  const handleDrop = (targetId: string) => {
    if (draggingId && draggingId !== targetId) onReorder(draggingId, targetId);
    setDraggingId(null);
    setOverId(null);
  };

  return (
    <section aria-labelledby="list-heading" data-testid="todo-list">
      <h2 id="list-heading" className="sr-only">
        Task list
      </h2>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {todos.length} {todos.length === 1 ? 'task' : 'tasks'} displayed
      </div>

      {todos.length === 0 ? (
        <EmptyState
          hasFilters={hasFilters}
          onCreate={onCreateFirst}
          onClearFilters={onClearFilters}
        />
      ) : (
        <ul ref={listRef} onKeyDown={handleListKeyDown} className="space-y-3" role="list" data-testid="task-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              tabIndex={todo.id === activeId ? 0 : -1}
              reorderEnabled={reorderEnabled}
              isDragging={todo.id === draggingId}
              isDropTarget={todo.id === overId && todo.id !== draggingId}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              onMove={onMove}
              onDragStartItem={setDraggingId}
              onDragOverItem={setOverId}
              onDropItem={handleDrop}
              onDragEnd={() => {
                setDraggingId(null);
                setOverId(null);
              }}
            />
          ))}
        </ul>
      )}
    </section>
  );
});
