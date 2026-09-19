/**
 * @fileoverview TodoStats component for the FocusList To-Do application.
 * @module components/TodoStats
 */

import React from 'react';
import { useTodoContext } from '../context/TodoContext';

export const TodoStats: React.FC = React.memo(function TodoStats() {
  const { stats } = useTodoContext();
  const completionPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <section
      aria-label="Task statistics"
      role="status"
      aria-live="polite"
      data-testid="task-statistics"
      className="mb-6 animate-fade-in"
    >
      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-3 rounded-xl border border-blue-200/50 dark:border-blue-700/50 shadow-sm"
          data-testid="total-tasks-stat"
        >
          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mb-1">
            Total Tasks
          </p>
          <p className="text-2xl font-black text-blue-900 dark:text-blue-100">{stats.total}</p>
        </div>
        <div
          className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-3 rounded-xl border border-orange-200/50 dark:border-orange-700/50 shadow-sm"
          data-testid="pending-tasks-stat"
        >
          <p className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-widest mb-1">
            Pending Tasks
          </p>
          <p className="text-2xl font-black text-orange-900 dark:text-orange-100">{stats.pending}</p>
        </div>
        <div
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-3 rounded-xl border border-green-200/50 dark:border-green-700/50 shadow-sm"
          data-testid="completed-tasks-stat"
        >
          <p className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase tracking-widest mb-1">
            Completed Tasks
          </p>
          <p className="text-2xl font-black text-green-900 dark:text-green-100">{stats.completed}</p>
        </div>
      </div>

      <div className="w-full" data-testid="progress-bar">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Progress</span>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{completionPercent}%</span>
        </div>
        <div
          className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden"
          role="progressbar"
          aria-valuenow={completionPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Task completion: ${completionPercent}% complete`}
        >
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>
    </section>
  );
});
