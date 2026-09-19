/**
 * @fileoverview TodoItem component for the FocusList To-Do application.
 * @module components/TodoItem
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TrashIcon, CheckCircleIcon, CircleIcon, PencilIcon, CheckIcon, XIcon } from './Icons';
import type { Todo } from '../types';
import { PRIORITY_COLORS } from '../utils/constants';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = React.memo(function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== todo.text) {
      onEdit(todo.id, trimmed);
    }
    setIsEditing(false);
  }, [editValue, todo.id, todo.text, onEdit]);

  const handleCancel = useCallback(() => {
    setEditValue(todo.text);
    setIsEditing(false);
  }, [todo.text]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  const startEditing = useCallback(() => {
    setEditValue(todo.text);
    setIsEditing(true);
  }, [todo.text]);

  return (
    <li
      className={`group flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all duration-200 animate-slide-up ${
        todo.completed
          ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-70'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600'
      }`}
      data-testid="todo-item"
      aria-label={`Task: ${todo.text}, Priority: ${todo.priority}, ${todo.completed ? 'Completed' : 'Active'}`}
    >
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        <button
          onClick={() => onToggle(todo.id)}
          className="flex-shrink-0 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full transition-colors p-0.5 active:scale-90"
          aria-label={todo.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
          aria-pressed={todo.completed}
          data-testid="toggle-task"
        >
          {todo.completed ? (
            <CheckCircleIcon className="w-6 h-6 text-green-500" aria-hidden={true} />
          ) : (
            <CircleIcon className="w-6 h-6" aria-hidden={true} />
          )}
        </button>

        {isEditing ? (
          <div className="flex-1 flex gap-2 items-center">
            <label htmlFor={`edit-${todo.id}`} className="sr-only">Edit task title</label>
            <input
              ref={editInputRef}
              id={`edit-${todo.id}`}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="flex-1 px-3 py-1.5 text-sm border border-blue-400 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Edit task title"
              data-testid="edit-task-input"
            />
            <button
              onClick={handleSave}
              className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 p-1.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 active:scale-90"
              aria-label="Save edit"
              data-testid="save-edit-button"
            >
              <CheckIcon className="w-4 h-4" aria-hidden={true} />
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 active:scale-90"
              aria-label="Cancel edit"
              data-testid="cancel-edit-button"
            >
              <XIcon className="w-4 h-4" aria-hidden={true} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col overflow-hidden gap-1">
            <span
              className={`truncate transition-all text-sm sm:text-base ${
                todo.completed
                  ? 'text-gray-400 dark:text-gray-500 line-through'
                  : 'text-gray-800 dark:text-gray-100'
              }`}
              data-testid="task-title"
            >
              {todo.text}
            </span>
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block w-max border ${PRIORITY_COLORS[todo.priority]}`}
              data-testid="task-priority"
              aria-label={`Priority: ${todo.priority}`}
            >
              {todo.priority}
            </span>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="flex gap-1 flex-shrink-0 ml-2 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
          <button
            onClick={startEditing}
            className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1.5 transition-colors active:scale-90"
            aria-label={`Edit task: ${todo.text}`}
            data-testid="edit-task-button"
          >
            <PencilIcon className="w-4 h-4" aria-hidden={true} />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg p-1.5 transition-colors active:scale-90"
            aria-label={`Delete task: ${todo.text}`}
            data-testid="delete-task-button"
          >
            <TrashIcon className="w-4 h-4" aria-hidden={true} />
          </button>
        </div>
      )}
    </li>
  );
});
