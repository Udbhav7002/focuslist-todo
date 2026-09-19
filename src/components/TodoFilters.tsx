/**
 * @fileoverview TodoFilters component for the FocusList To-Do application.
 * @module components/TodoFilters
 */

import React from 'react';
import { SearchIcon } from './Icons';
import { useTodoContext } from '../context/TodoContext';
import { STATUS_FILTER_OPTIONS, PRIORITY_OPTIONS } from '../utils/constants';

export const TodoFilters: React.FC = React.memo(function TodoFilters() {
  const {
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter
  } = useTodoContext();

  const baseSelectClasses = "px-3 py-2 text-sm border-none bg-white dark:bg-gray-700 dark:text-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer w-full";

  return (
    <section
      className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-gray-50/80 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-700 animate-fade-in"
      aria-label="Filter and search tasks"
      data-testid="todo-filters"
    >
      <div className="relative col-span-1 sm:col-span-1">
        <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" aria-hidden={true} />
        <label htmlFor="search-tasks" className="sr-only">Search tasks by title</label>
        <input
          id="search-tasks"
          type="search"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border-none bg-white dark:bg-gray-700 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow placeholder:text-gray-400 dark:placeholder:text-gray-500"
          aria-label="Search tasks by title"
          data-testid="search-input"
        />
      </div>

      <div className="col-span-1 sm:col-span-1">
        <label htmlFor="status-filter" className="sr-only">Filter by status</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className={baseSelectClasses}
          aria-label="Filter tasks by status"
          data-testid="status-filter"
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="col-span-1 sm:col-span-1">
        <label htmlFor="priority-filter" className="sr-only">Filter by priority</label>
        <select
          id="priority-filter"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as typeof priorityFilter)}
          className={baseSelectClasses}
          aria-label="Filter tasks by priority"
          data-testid="priority-filter"
        >
          <option value="All">All Priority</option>
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </section>
  );
});
