/**
 * @fileoverview Search, status/priority/tag filters, sort selector,
 * and a one-click reset. The clear-search button only appears when needed.
 * @module components/TodoFilters
 */

import { memo } from 'react';
import type { ReactElement } from 'react';
import { FilterIcon, SearchIcon, XIcon } from './Icons';
import type { Priority, SortOption, StatusFilter } from '../types';
import {
  PRIORITY_OPTIONS,
  SORT_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from '../utils/constants';

export interface TodoFiltersProps {
  search: string;
  status: StatusFilter;
  priority: 'All' | Priority;
  tag: string;
  sort: SortOption;
  allTags: string[];
  hasFilters: boolean;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: StatusFilter) => void;
  onPriorityChange: (v: 'All' | Priority) => void;
  onTagChange: (v: string) => void;
  onSortChange: (v: SortOption) => void;
  onReset: () => void;
}

const SELECT_CLS =
  'px-3 py-2.5 text-sm rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer min-h-[44px]';

export const TodoFilters = memo(function TodoFilters({
  search,
  status,
  priority,
  tag,
  sort,
  allTags,
  hasFilters,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onTagChange,
  onSortChange,
  onReset,
}: TodoFiltersProps): ReactElement {
  return (
    <section
      aria-labelledby="filters-heading"
      className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/50 p-3 space-y-3"
      data-testid="todo-filters"
    >
      <h2 id="filters-heading" className="sr-only">
        Search, filter, and sort tasks
      </h2>

      <div className="relative">
        <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <label htmlFor="search-tasks" className="sr-only">
          Search tasks by title
        </label>
        <input
          id="search-tasks"
          type="search"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search tasks by title"
          data-testid="search-input"
          className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
            data-testid="clear-search-button"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterIcon className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />

        <label htmlFor="status-filter" className="sr-only">
          Filter by status
        </label>
        <select
          id="status-filter"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
          aria-label="Filter tasks by status"
          data-testid="status-filter"
          className={SELECT_CLS}
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label htmlFor="priority-filter" className="sr-only">
          Filter by priority
        </label>
        <select
          id="priority-filter"
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value as 'All' | Priority)}
          aria-label="Filter tasks by priority"
          data-testid="priority-filter"
          className={SELECT_CLS}
        >
          <option value="All">All priorities</option>
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label htmlFor="tag-filter" className="sr-only">
          Filter by tag
        </label>
        <select
          id="tag-filter"
          value={tag}
          onChange={(e) => onTagChange(e.target.value)}
          aria-label="Filter tasks by tag"
          data-testid="tag-filter"
          className={SELECT_CLS}
          disabled={allTags.length === 0}
        >
          <option value="All">All tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              #{t}
            </option>
          ))}
        </select>

        <label htmlFor="sort-select" className="sr-only">
          Sort tasks
        </label>
        <select
          id="sort-select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          aria-label="Sort tasks"
          data-testid="sort-select"
          className={SELECT_CLS}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            aria-label="Reset all filters"
            data-testid="reset-filters-button"
            className="ml-auto px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 hover:bg-red-100 dark:hover:bg-red-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors min-h-[44px]"
          >
            Reset filters
          </button>
        )}
      </div>
    </section>
  );
});
