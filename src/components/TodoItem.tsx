/**
 * @fileoverview A single task row: completion toggle, priority badge,
 * due-date badge (with overdue highlighting), tag chips, inline editing,
 * delete, and reorder (drag handle + keyboard-accessible move buttons,
 * Alt+ArrowUp/Down).
 * @module components/TodoItem
 */

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, ReactElement } from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  CircleIcon,
  GripVerticalIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
} from './Icons';
import type { Todo } from '../types';
import { DUE_TONE_COLORS, PRIORITY_COLORS } from '../utils/constants';
import { dueInfo, isOverdue } from '../utils/date';

const ACTION_BTN =
  'p-2 rounded-lg text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors';

export interface TodoItemProps {
  todo: Todo;
  /** Roving-tabindex value for the toggle button (managed by TodoList). */
  tabIndex: number;
  /** True when manual sorting without active filters (enables reorder UI). */
  reorderEnabled: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onDragStartItem: (id: string) => void;
  onDragOverItem: (id: string) => void;
  onDropItem: (id: string) => void;
  onDragEnd: () => void;
}

export const TodoItem = memo(function TodoItem({
  todo,
  tabIndex,
  reorderEnabled,
  isDragging,
  isDropTarget,
  onToggle,
  onDelete,
  onEdit,
  onMove,
  onDragStartItem,
  onDragOverItem,
  onDropItem,
  onDragEnd,
}: TodoItemProps): ReactElement {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const editInputRef = useRef<HTMLInputElement>(null);

  /** Focus + select the edit input when entering edit mode. */
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== todo.text) onEdit(todo.id, trimmed);
    setIsEditing(false);
  }, [editValue, todo.id, todo.text, onEdit]);

  const handleCancel = useCallback(() => {
    setEditValue(todo.text);
    setIsEditing(false);
  }, [todo.text]);

  const handleEditKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const startEditing = () => {
    setEditValue(todo.text);
    setIsEditing(true);
  };

  const due = dueInfo(todo.dueDate);
  const overdue = isOverdue(todo.dueDate, todo.completed);

  const handleItemKeyDown = (e: ReactKeyboardEvent<HTMLLIElement>) => {
    if (!reorderEnabled) return;
    if (e.altKey && e.key === 'ArrowUp') {
      e.preventDefault();
      onMove(todo.id, -1);
    } else if (e.altKey && e.key === 'ArrowDown') {
      e.preventDefault();
      onMove(todo.id, 1);
    }
  };

  return (
    <li
      data-todo-id={todo.id}
      draggable={reorderEnabled && !isEditing}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', todo.id);
        onDragStartItem(todo.id);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        onDragOverItem(todo.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDropItem(todo.id);
      }}
      onDragEnd={onDragEnd}
      onKeyDown={handleItemKeyDown}
      aria-keyshortcuts={reorderEnabled ? 'Alt+ArrowUp Alt+ArrowDown' : undefined}
      aria-label={`Task: ${todo.text}. Priority ${todo.priority}. ${todo.completed ? 'Completed' : 'Active'}.`}
      data-testid="todo-item"
      className={`task-row group relative flex items-center gap-2 sm:gap-3 rounded-xl border p-3 sm:p-4 transition-all duration-200 ${
        isDragging
          ? 'opacity-40 scale-[0.99]'
          : isDropTarget
            ? 'border-blue-400 dark:border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900'
            : overdue
              ? 'bg-white dark:bg-gray-800 border-red-300 dark:border-red-800 shadow-sm hover:shadow-md'
              : todo.completed
                ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-70'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'
      }`}
    >
      {reorderEnabled && (
        <span
          className="hidden sm:flex flex-shrink-0 text-gray-300 dark:text-gray-600 cursor-grab active:cursor-grabbing"
          aria-hidden="true"
          title="Drag to reorder"
        >
          <GripVerticalIcon className="w-4 h-4" />
        </span>
      )}

      <button
        type="button"
        data-todo-toggle
        tabIndex={tabIndex}
        onClick={() => onToggle(todo.id)}
        aria-label={
          todo.completed
            ? `Mark "${todo.text}" as incomplete`
            : `Mark "${todo.text}" as complete`
        }
        aria-pressed={todo.completed}
        data-testid="toggle-task"
        className="flex-shrink-0 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full transition-colors p-0.5"
      >
        {todo.completed ? (
          <CheckCircleIcon className="w-6 h-6 text-green-500" />
        ) : (
          <CircleIcon className="w-6 h-6" />
        )}
      </button>

      {isEditing ? (
        <div className="flex-1 flex gap-2 items-center min-w-0">
          <label htmlFor={`edit-${todo.id}`} className="sr-only">
            Edit task title
          </label>
          <input
            ref={editInputRef}
            id={`edit-${todo.id}`}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={handleSave}
            aria-label="Edit task title"
            data-testid="edit-task-input"
            className="flex-1 min-w-0 px-3 py-2 text-sm border border-blue-400 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault() /* prevent blur-save race */}
            onClick={handleSave}
            aria-label="Save edit"
            data-testid="save-edit-button"
            className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          >
            <CheckIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleCancel}
            aria-label="Cancel edit"
            data-testid="cancel-edit-button"
            className="text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <span
            className={`truncate text-sm sm:text-base transition-all ${
              todo.completed
                ? 'text-gray-400 dark:text-gray-500 line-through'
                : 'text-gray-800 dark:text-gray-100'
            }`}
            data-testid="task-title"
          >
            {todo.text}
          </span>
          <span className="flex flex-wrap items-center gap-1.5">
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[todo.priority]}`}
              data-testid="task-priority"
            >
              {todo.priority}
            </span>
            {due && (
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${DUE_TONE_COLORS[due.tone]}`}
                data-testid="task-due"
              >
                <CalendarIcon className="w-3 h-3" />
                {due.text}
              </span>
            )}
            {todo.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                data-testid="task-tag"
              >
                #{tag}
              </span>
            ))}
          </span>
        </div>
      )}

      {!isEditing && (
        <div className="flex items-center gap-0.5 flex-shrink-0 ml-1 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
          {reorderEnabled && (
            <>
              <button
                type="button"
                onClick={() => onMove(todo.id, -1)}
                aria-label={`Move "${todo.text}" up`}
                data-testid="move-up-button"
                className={ACTION_BTN}
              >
                <ArrowUpIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onMove(todo.id, 1)}
                aria-label={`Move "${todo.text}" down`}
                data-testid="move-down-button"
                className={ACTION_BTN}
              >
                <ArrowDownIcon className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={startEditing}
            aria-label={`Edit task: ${todo.text}`}
            data-testid="edit-task-button"
            className={ACTION_BTN}
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(todo.id)}
            aria-label={`Delete task: ${todo.text}`}
            data-testid="delete-task-button"
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </li>
  );
});
