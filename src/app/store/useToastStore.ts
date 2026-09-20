import { create } from 'zustand';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastData {
  id: number;
  message: string;
  action?: ToastAction;
}

interface ToastState {
  toast: ToastData | null;
  showToast: (message: string, action?: ToastAction) => void;
  hideToast: () => void;
}

let toastTimer: ReturnType<typeof setTimeout>;

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  showToast: (message, action) => {
    clearTimeout(toastTimer);
    set({ toast: { id: Date.now(), message, action } });
    toastTimer = setTimeout(() => {
      set({ toast: null });
    }, 5000);
  },
  hideToast: () => {
    clearTimeout(toastTimer);
    set({ toast: null });
  },
}));
