/**
 * @fileoverview TodoFilters component for the FocusList To-Do application.
 * Provides search, status filtering, and priority filtering controls.
 * @module components/TodoFilters
 */

import React from 'react';
import { SearchIcon } from './Icons';
import type { Priority, StatusFilter } from '../types';
import { STATUS_FILTER_OPTIONS, PRIORITY_OPTIONS } from '../utils/constants';

/**
 * Props for the TodoFilters component.
 */
interface TodoFiltersProps {
  /** The current search query string. */
  searchQuery: string;
  /** Callback to update the search query. */
  onSearchChange: (query: string) => void;
  /** The currently active status filter. */
  statusFilter: StatusFilter;
  /** Callback to update the status filter. */
  onStatusFilterChange: (filter: StatusFilter) => void;
  /** The currently active priority filter. */
  priorityFilter: 'All' | Priority;
  /** Callback to update the priority filter. */
  onPriorityFilterChange: (filter: 'All' | Priority) => void;
}

/**
 * Renders the search and filtering controls for the task list.
 *
 * @param {TodoFiltersProps} props - Component props.
 * @returns {React.ReactElement} The rendered filter controls.
 */
export const TodoFilters: React.FC<TodoFiltersProps> = React.memo(function TodoFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
}) {
  return (
    <section
      className="flex flex-col sm:flex-row gap-3 mb-6 bg-gray-50/80 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-700"
      aria-label="Filter and search tasks"
      data-testid="todo-filters"
    >
      <div className="relative flex-1">
        <SearchIcon
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
          aria-hidden={true}
        />
        <label htmlFor="search-tasks" className="sr-only">
          Search tasks by title
        </label>
        <input
          id="search-tasks"
          type="search"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border-none bg-white dark:bg-gray-700 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow placeholder:text-gray-400 dark:placeholder:text-gray-500"
          aria-label="Search tasks by title"
          data-testid="search-input"
        />
      </div>

      <div className="flex gap-2">
        <div>
          <label htmlFor="status-filter" className="sr-only">
            Filter by status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
            className="px-3 py-2 text-sm border-none bg-white dark:bg-gray-700 dark:text-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
            aria-label="Filter tasks by status"
            data-testid="status-filter"
          >
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority-filter" className="sr-only">
            Filter by priority
          </label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value as 'All' | Priority)}
            className="px-3 py-2 text-sm border-none bg-white dark:bg-gray-700 dark:text-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
            aria-label="Filter tasks by priority"
            data-testid="priority-filter"
          >
            <option value="All">All Priority</option>
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
});
