import { useToastStore } from '../../app/store/useToastStore';

export function UndoToast() {
  const toast = useToastStore((s) => s.toast);
  const hideToast = useToastStore((s) => s.hideToast);

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
      >
        <span>{toast.message}</span>
        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action?.onClick();
              hideToast();
            }}
            className="px-3 py-1.5 rounded-lg font-semibold text-blue-300 dark:text-blue-700 hover:bg-white/10 dark:hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors"
          >
            {toast.action.label}
          </button>
        )}
      </div>
    </div>
  );
}
