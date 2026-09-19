/**
 * @fileoverview Task creation form: title, priority, optional due date,
 * and comma-separated tags. Validates input, resets cleanly, and returns
 * focus to the title field after submission.
 * @module components/TodoForm
 */

import { memo, useRef, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { CalendarIcon, PlusCircleIcon, TagIcon } from './Icons';
import type { Priority } from '../types';
import { MAX_TASK_LENGTH, PRIORITY_OPTIONS } from '../utils/constants';
import { todayISO } from '../utils/date';
import { parseTags } from '../utils/sanitize';

export interface TodoFormProps {
  onAdd: (text: string, input: { priority: Priority; dueDate: string | null; tags: string[] }) => void;
}

export const TodoForm = memo(function TodoForm({ onAdd }: TodoFormProps): ReactElement {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const remaining = MAX_TASK_LENGTH - text.length;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, {
      priority,
      dueDate: dueDate || null,
      tags: parseTags(tagsInput),
    });
    setText('');
    setDueDate('');
    setTagsInput('');
    setPriority('Medium');
    inputRef.current?.focus();
  };

  return (
    <section aria-labelledby="create-heading">
      <h2 id="create-heading" className="sr-only">Create a new task</h2>
      <form
        onSubmit={handleSubmit}
        className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:p-4 shadow-sm space-y-3"
        data-testid="todo-form"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor="new-task-input" className="sr-only">
              Task title
            </label>
            <input
              ref={inputRef}
              id="new-task-input"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be done?"
              maxLength={MAX_TASK_LENGTH}
              autoComplete="off"
              aria-label="Enter a task title"
              data-testid="task-input"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-shadow"
            />
            {text.length > MAX_TASK_LENGTH - 50 && (
              <p className="mt-1 text-xs text-gray-400 text-right" aria-live="polite">
                {remaining} characters left
              </p>
            )}
          </div>

          <div className="sm:w-40">
            <label htmlFor="priority-select" className="sr-only">
              Priority level
            </label>
            <select
              id="priority-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              aria-label="Select task priority"
              data-testid="priority-select"
              className="w-full px-3 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium cursor-pointer"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} priority
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="sm:w-48">
            <label htmlFor="due-date-input" className="sr-only">
              Due date (optional)
            </label>
            <div className="relative">
              <CalendarIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                id="due-date-input"
                type="date"
                value={dueDate}
                min={todayISO()}
                onChange={(e) => setDueDate(e.target.value)}
                aria-label="Due date (optional)"
                data-testid="due-date-input"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>

          <div className="flex-1">
            <label htmlFor="tags-input" className="sr-only">
              Tags, comma separated (optional)
            </label>
            <div className="relative">
              <TagIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                id="tags-input"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Tags, comma separated (optional)"
                autoComplete="off"
                aria-label="Tags, comma separated (optional)"
                data-testid="tags-input"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!text.trim()}
            aria-label="Add task"
            data-testid="add-task-button"
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-semibold text-sm min-h-[44px]"
          >
            <PlusCircleIcon className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </form>
    </section>
  );
});
