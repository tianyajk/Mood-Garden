import { AnimatePresence, motion } from 'framer-motion';
import { duration, easing } from '@/config/theme';

interface CompanionQuoteProps {
  text: string;
  loading: boolean;
  onRefresh: () => void;
}

/** 每日陪伴语：衬线斜体居中，可点击刷新（旧句淡出、新句淡入） */
export function CompanionQuote({ text, loading, onRefresh }: CompanionQuoteProps) {
  return (
    <div className="flex items-center justify-center gap-3 text-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={text}
          className="font-display italic text-body-lg text-ink-600"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 0.85, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: duration.slow, ease: easing.gentle }}
        >
          ❝ {text} ❞
        </motion.p>
      </AnimatePresence>
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        aria-label="换一句陪伴语"
        className="text-ink-400 transition-colors hover:text-brand-green disabled:opacity-50"
      >
        ↻
      </button>
    </div>
  );
}
