import { useState, useEffect } from 'react';
import { useTodoStore } from '../../app/store/useTodoStore';
import { useShallow } from 'zustand/react/shallow';
import { selectAvailableTags } from '../../app/store/selectors';
import { STATUS_FILTER_OPTIONS, SORT_OPTIONS, PRIORITY_OPTIONS } from '../../entities/todo/model/constants';
import type { SortOption, Priority } from '../../entities/todo/model/types';
import { SearchIcon, XIcon } from '../../components/Icons';

export function TodoFilterBar() {
  const storeSearch = useTodoStore((s) => s.search);
  const [localSearch, setLocalSearch] = useState(storeSearch);

  useEffect(() => {
    setLocalSearch(storeSearch);
  }, [storeSearch]);

  const setSearch = useTodoStore((s) => s.setSearch);

  useEffect(() => {
    const t = setTimeout(() => {
      if (storeSearch !== localSearch) setSearch(localSearch);
    }, 250);
    return () => clearTimeout(t);
  }, [localSearch, setSearch, storeSearch]);

  const statusFilter = useTodoStore((s) => s.statusFilter);
  const priorityFilter = useTodoStore((s) => s.priorityFilter);
  const tagFilter = useTodoStore((s) => s.tagFilter);
  const sortOption = useTodoStore((s) => s.sortOption);
  const setStatusFilter = useTodoStore((s) => s.setStatusFilter);
  const setPriorityFilter = useTodoStore((s) => s.setPriorityFilter);
  const setTagFilter = useTodoStore((s) => s.setTagFilter);
  const setSortOption = useTodoStore((s) => s.setSortOption);
  const resetFilters = useTodoStore((s) => s.resetFilters);

  const availableTags = useTodoStore(useShallow(selectAvailableTags));

  const activeFilters = (localSearch ? 1 : 0) + (statusFilter !== 'All' ? 1 : 0) + (priorityFilter !== 'All' ? 1 : 0) + (tagFilter !== 'All' ? 1 : 0);

  return (
    <div className="space-y-4" aria-label="Filters and Sorting">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <label htmlFor="search-input" className="sr-only">Search tasks</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            id="search-input"
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search tasks... ( / )"
            className="block w-full min-h-[44px] pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            aria-label="Sort by"
            className="min-h-[44px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1" role="group" aria-label="Status filters">
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1 min-h-[44px] text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 ${
                statusFilter === opt.value
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              aria-pressed={statusFilter === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as 'All' | Priority)}
          aria-label="Filter by priority"
          className="min-h-[44px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
        >
          <option value="All">All Priorities</option>
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {availableTags.length > 0 && (
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            aria-label="Filter by tag"
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 max-w-[150px]"
          >
            <option value="All">All Tags</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        )}

        {activeFilters > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center justify-center gap-1 min-h-[44px] min-w-[44px] text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 rounded"
          >
            <XIcon className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
