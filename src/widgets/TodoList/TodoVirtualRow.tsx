import { useState, memo, useCallback } from 'react';
import type { Todo } from '../../entities/todo/model/types';
import { formatRelativeDate, isOverdue } from '../../entities/todo/lib/dateUtils';
import { CheckIcon, TrashIcon, PencilIcon, CalendarIcon, TagIcon } from '../../components/Icons';

interface Props {
  todo: Todo;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Todo>) => void;
  onKeyDown: (index: number, key: string) => void;
}

const PRIORITY_STYLES = {
  High: 'border-l-4 border-l-red-500 bg-red-50/20 dark:bg-red-950/10',
  Medium: 'border-l-4 border-l-amber-500 bg-amber-50/20 dark:bg-amber-950/10',
  Low: 'border-l-4 border-l-blue-500 bg-blue-50/20 dark:bg-blue-950/10',
};

export const TodoVirtualRow = memo(function TodoVirtualRow({
  todo,
  index,
  onToggle,
  onDelete,
  onUpdate,
  onKeyDown,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const overdue = isOverdue(todo.dueDate, todo.completed);

  const handleSave = useCallback(() => {
    if (editText.trim() && editText !== todo.text) {
      onUpdate(todo.id, { text: editText.trim() });
    }
    setIsEditing(false);
  }, [editText, todo.id, todo.text, onUpdate]);

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      onKeyDown(index, e.key);
    }
  }, [index, onKeyDown]);

  return (
    <article
      className={`group flex items-center justify-between gap-3 p-3.5 h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-all duration-150 ${
        PRIORITY_STYLES[todo.priority]
      }`}
      aria-label={`Task: ${todo.text}`}
      onKeyDown={handleKey}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex items-center justify-center min-w-[44px] min-h-[44px]">
          <button
            type="button"
            data-action="toggle"
            onClick={() => onToggle(todo.id)}
            className={`flex-shrink-0 w-6 h-6 rounded border transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 ${
              todo.completed
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500'
            }`}
            aria-pressed={todo.completed}
            aria-label={todo.completed ? `Mark "${todo.text}" incomplete` : `Mark "${todo.text}" complete`}
          >
            {todo.completed && <CheckIcon className="w-4 h-4" aria-hidden="true" />}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 font-sans"
              autoFocus
              aria-label="Edit task title"
            />
          ) : (
            <div className="flex flex-col">
              <span
                className={`text-sm font-medium tracking-tight truncate transition-colors ${
                  todo.completed
                    ? 'line-through text-gray-400 dark:text-gray-500'
                    : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                {todo.text}
              </span>

              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                {todo.dueDate && (
                  <span className={`flex items-center gap-1 font-mono ${overdue ? 'text-red-600 font-bold' : ''}`}>
                    <CalendarIcon className="w-3 h-3" aria-hidden="true" />
                    <time dateTime={todo.dueDate}>{formatRelativeDate(todo.dueDate)}</time>
                  </span>
                )}

                {todo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono text-[10px]"
                  >
                    <TagIcon className="w-2.5 h-2.5" aria-hidden="true" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => setIsEditing((v) => !v)}
          className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
          aria-label={`Edit task "${todo.text}"`}
        >
          <PencilIcon className="w-4 h-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => {
            onDelete(todo.id);
          }}
          className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
          aria-label={`Delete task "${todo.text}"`}
        >
          <TrashIcon className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
});
