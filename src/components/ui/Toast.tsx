import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { duration, easing } from '@/config/theme';

type ToastTone = 'success' | 'warning';

interface ToastItem {
  id: number;
  text: string;
  tone: ToastTone;
}

interface ToastContextValue {
  /** 顶部居中轻提示，2s 自动消失 */
  notify: (text: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_ICON: Record<ToastTone, string> = {
  success: '✓',
  warning: '⚠',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const notify = useCallback((text: string, tone: ToastTone = 'success') => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, text, tone }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-6 z-[60] flex flex-col items-center gap-2">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-caption text-ink-900"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: duration.base, ease: easing.soft }}
            >
              <span className={t.tone === 'warning' ? 'text-warning' : 'text-success'}>
                {TONE_ICON[t.tone]}
              </span>
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast 必须在 <ToastProvider> 内使用');
  }
  return ctx;
}
