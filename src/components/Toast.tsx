/**
 * @fileoverview Lightweight toast notification with an optional action
 * (used for Undo). Announced politely to screen readers.
 * @module components/Toast
 */

import type { ReactElement } from 'react';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastData {
  id: number;
  message: string;
  action?: ToastAction;
}

export interface ToastProps {
  toast: ToastData | null;
}

export function Toast({ toast }: ToastProps): ReactElement | null {
  if (!toast) return null;
  return (
    <div
      className="fixed bottom-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <div
        key={toast.id}
        className="pointer-events-auto flex items-center gap-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 pl-4 pr-2 py-2.5 rounded-xl shadow-2xl text-sm font-medium animate-toast-in"
        data-testid="toast"
      >
        <span>{toast.message}</span>
        {toast.action && (
          <button
            type="button"
            onClick={toast.action.onClick}
            className="px-3 py-1.5 rounded-lg font-semibold text-blue-300 dark:text-blue-700 hover:bg-white/10 dark:hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors"
            data-testid="toast-action"
          >
            {toast.action.label}
          </button>
        )}
      </div>
    </div>
  );
}
