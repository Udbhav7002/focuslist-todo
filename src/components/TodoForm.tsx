/**
 * @fileoverview TodoForm component for the FocusList To-Do application.
 * @module components/TodoForm
 */

import React, { useState, useRef } from 'react';
import { PlusCircleIcon } from './Icons';
import { useTodoContext } from '../context/TodoContext';
import { PRIORITY_OPTIONS, MAX_TASK_LENGTH } from '../utils/constants';

export const TodoForm: React.FC = React.memo(function TodoForm() {
  const { addTodo } = useTodoContext();
  const [inputValue, setInputValue] = useState('');
  const [priorityInput, setPriorityInput] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    addTodo(trimmed, priorityInput);
    setInputValue('');
    setPriorityInput('Medium');
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 mb-6 flex-wrap sm:flex-nowrap bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in"
      aria-label="Create a new task"
      data-testid="todo-form"
    >
      <label htmlFor="new-task-input" className="sr-only">Task title</label>
      <input
        ref={inputRef}
        id="new-task-input"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="What needs to be done?"
        maxLength={MAX_TASK_LENGTH}
        className="flex-1 min-w-[180px] px-4 py-2.5 bg-transparent dark:text-gray-100 focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
        aria-label="Enter a task title"
        data-testid="task-input"
        autoComplete="off"
      />

      <label htmlFor="priority-select" className="sr-only">Priority level</label>
      <select
        id="priority-select"
        value={priorityInput}
        onChange={(e) => setPriorityInput(e.target.value as 'High' | 'Medium' | 'Low')}
        className="px-3 py-2 border-l border-gray-200 dark:border-gray-600 bg-transparent dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-sm cursor-pointer"
        aria-label="Select task priority"
        data-testid="priority-select"
      >
        {PRIORITY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <button
        type="submit"
        disabled={!inputValue.trim()}
        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-medium shadow-sm"
        aria-label="Add task"
        data-testid="add-task-button"
      >
        <PlusCircleIcon className="w-4 h-4" aria-hidden={true} />
        <span className="hidden sm:inline">Add Task</span>
      </button>
    </form>
  );
});
