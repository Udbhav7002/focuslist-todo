/**
 * @fileoverview Friendly placeholder shown when no tasks are visible.
 * Offers a direct call-to-action instead of a dead end.
 * @module components/EmptyState
 */

import { memo } from 'react';
import type { ReactElement } from 'react';

export interface EmptyStateProps {
  /** True when search/filters hide otherwise-existing tasks. */
  hasFilters: boolean;
  /** Focuses the task form (empty list CTA). */
  onCreate: () => void;
  /** Clears all active filters (filtered-empty CTA). */
  onClearFilters: () => void;
}

export const EmptyState = memo(function EmptyState({
  hasFilters,
  onCreate,
  onClearFilters,
}: EmptyStateProps): ReactElement {
  return (
    <div
      className="text-center py-14 px-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/40"
      role="status"
      data-testid="empty-state"
    >
      <div className="text-5xl mb-4" aria-hidden="true">
        {hasFilters ? '🔍' : '📝'}
      </div>
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
        {hasFilters ? 'No tasks match your filters' : 'No tasks yet'}
      </p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 mb-6">
        {hasFilters
          ? 'Try adjusting your search or filter criteria.'
          : 'Capture your first task and start focusing.'}
      </p>
      {hasFilters ? (
        <button
          type="button"
          onClick={onClearFilters}
          className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors min-h-[44px]"
          data-testid="empty-clear-filters"
        >
          Clear all filters
        </button>
      ) : (
        <button
          type="button"
          onClick={onCreate}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 transition-colors min-h-[44px]"
          data-testid="empty-create-task"
        >
          Create your first task
        </button>
      )}
    </div>
  );
});
