/**
 * @fileoverview EmptyState component for the FocusList To-Do application.
 * @module components/EmptyState
 */

import React from 'react';

interface EmptyStateProps {
  hasFilters: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = React.memo(function EmptyState({ hasFilters }) {
  return (
    <div
      className="text-center py-16 px-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 animate-fade-in"
      role="status"
      aria-live="polite"
      data-testid="empty-state"
    >
      <div className="text-5xl mb-4" aria-hidden="true">
        {hasFilters ? '🔍' : '📝'}
      </div>
      <p className="text-gray-600 dark:text-gray-300 font-semibold text-lg">
        {hasFilters ? 'No tasks match your filters' : 'No tasks yet'}
      </p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
        {hasFilters ? 'Try adjusting your search or filter criteria.' : 'Add your first task above to get started!'}
      </p>
    </div>
  );
});
