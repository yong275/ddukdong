import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const show = useCallback((message, duration = 2200) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(message);
    timerRef.current = setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="
            fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]
            px-5 py-3 rounded-xl shadow-lg
            bg-[--surface] text-[--text] text-sm font-medium
            border border-[--border]
            animate-fade-up
          "
        >
          {toast}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
