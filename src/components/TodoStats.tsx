/**
 * @fileoverview Live statistics dashboard: total / pending / completed /
 * overdue cards plus an animated progress ring that respects
 * prefers-reduced-motion.
 * @module components/TodoStats
 */

import { memo } from 'react';
import type { ReactElement } from 'react';
import type { TodoStats as TodoStatsType } from '../types';
import { useReducedMotion } from '../hooks/useReducedMotion';

export interface TodoStatsProps {
  stats: TodoStatsType;
}

export const TodoStats = memo(function TodoStats({ stats }: TodoStatsProps): ReactElement {
  const reducedMotion = useReducedMotion();
  const percent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const R = 30;
  const CIRC = 2 * Math.PI * R;

  const cards = [
    {
      key: 'total',
      label: 'Total',
      value: stats.total,
      cls: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200/60 dark:border-blue-700/50 text-blue-900 dark:text-blue-100',
      labelCls: 'text-blue-600 dark:text-blue-400',
    },
    {
      key: 'pending',
      label: 'Pending',
      value: stats.pending,
      cls: 'from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200/60 dark:border-orange-700/50 text-orange-900 dark:text-orange-100',
      labelCls: 'text-orange-600 dark:text-orange-400',
    },
    {
      key: 'completed',
      label: 'Completed',
      value: stats.completed,
      cls: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200/60 dark:border-green-700/50 text-green-900 dark:text-green-100',
      labelCls: 'text-green-600 dark:text-green-400',
    },
    {
      key: 'overdue',
      label: 'Overdue',
      value: stats.overdue,
      cls: 'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-red-200/60 dark:border-red-700/50 text-red-900 dark:text-red-100',
      labelCls: 'text-red-600 dark:text-red-400',
    },
  ] as const;

  return (
    <section aria-labelledby="stats-heading" aria-live="polite" className="mb-6" data-testid="task-statistics">
      <h2 id="stats-heading" className="sr-only">
        Task statistics
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {cards.map((c) => (
          <div
            key={c.key}
            className={`bg-gradient-to-br p-3 rounded-xl border shadow-sm ${c.cls}`}
            data-testid={`${c.key}-tasks-stat`}
          >
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${c.labelCls}`}>
              {c.label}
            </p>
            <p className="text-2xl font-black tabular-nums">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${percent}% of tasks completed`}
          className="flex-shrink-0"
          data-testid="progress-ring"
        >
          <circle cx="40" cy="40" r={R} strokeWidth="8" fill="none" className="stroke-gray-200 dark:stroke-gray-700" />
          <circle
            cx="40"
            cy="40"
            r={R}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC - (percent / 100) * CIRC}
            transform="rotate(-90 40 40)"
            className={`stroke-blue-500 ${reducedMotion ? '' : 'transition-all duration-500 ease-out'}`}
          />
          <text
            x="40"
            y="45"
            textAnchor="middle"
            className="fill-gray-900 dark:fill-gray-100 text-[13px] font-bold"
          >
            {percent}%
          </text>
        </svg>
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {stats.completed} of {stats.total} tasks completed
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {stats.pending} pending
            {stats.overdue > 0 && <span className="text-red-500 dark:text-red-400 font-medium"> · {stats.overdue} overdue</span>}
          </p>
        </div>
      </div>
    </section>
  );
});
