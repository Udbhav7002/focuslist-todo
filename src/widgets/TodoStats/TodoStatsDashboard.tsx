import { useTodoStore } from '../../app/store/useTodoStore';
import { useShallow } from 'zustand/react/shallow';
import { selectTodoStats } from '../../app/store/selectors';
import { CheckCircleIcon, ClockIcon, AlertCircleIcon, ActivityIcon } from '../../components/Icons';

export function TodoStatsDashboard() {
  const stats = useTodoStore(useShallow(selectTodoStats));

  return (
    <section aria-label="Task statistics" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
          <ActivityIcon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Total</p>
          <p className="text-xl font-bold font-mono">{stats.total}</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-3">
        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
          <CheckCircleIcon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Completed</p>
          <p className="text-xl font-bold font-mono">{stats.completed}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-3">
        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
          <ClockIcon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Pending</p>
          <p className="text-xl font-bold font-mono">{stats.pending}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-3">
        <div className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
          <AlertCircleIcon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Overdue</p>
          <p className="text-xl font-bold font-mono">{stats.overdue}</p>
        </div>
      </div>
    </section>
  );
}
