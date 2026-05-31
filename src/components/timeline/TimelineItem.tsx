import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MoodRecord } from '@/types/mood';
import { getEmotionConfig } from '@/config/emotions';
import { formatShortDate } from '@/utils/date';

interface TimelineItemProps {
  record: MoodRecord;
  onClick: (record: MoodRecord) => void;
  onDelete?: (id: string) => void;
}

export function TimelineItem({ record, onClick, onDelete }: TimelineItemProps) {
  const [confirming, setConfirming] = useState(false);
  const configs = record.emotions.map(getEmotionConfig);
  const emojis = configs.map((c) => c.emoji).join(' ');
  const labels = configs.map((c) => c.label).join('、');
  const primary = configs[0];

  return (
    <div className="group relative mb-3">
      <AnimatePresence mode="wait" initial={false}>
        {!confirming ? (
          <motion.div
            key="normal"
            className="flex items-center rounded-xl transition-colors hover:bg-[#FFFDF7]/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <button
              type="button"
              onClick={() => onClick(record)}
              className="flex flex-1 items-start gap-4 px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20"
            >
              <span className="mt-0.5 text-lg" aria-hidden>{emojis}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-caption text-ink-900 font-medium">{labels}</span>
                  <span className="h-1 w-1 rounded-full bg-ink-400/40" />
                  <span className="text-micro text-ink-400 tabular-nums">{formatShortDate(record.date)}</span>
                </div>
                {record.description && (
                  <p className="mt-0.5 text-caption text-ink-600 line-clamp-1">{record.description}</p>
                )}
              </div>
              {primary && (
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full transition-opacity group-hover:opacity-0"
                  style={{ backgroundColor: primary.color }}
                />
              )}
            </button>

            {onDelete && (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                aria-label="删除记录"
                className="px-3 py-3 text-ink-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
              >
                ✕
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="confirm"
            className="flex items-center justify-between rounded-xl bg-red-50/70 px-4 py-3"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.12 }}
          >
            <span className="text-caption text-ink-700">确认删除这条记录？</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { onDelete?.(record.id); setConfirming(false); }}
                className="rounded-xl bg-red-100 px-3 py-1 text-micro text-red-500 hover:bg-red-200 transition-colors"
              >
                删除
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-xl bg-bg-sunken px-3 py-1 text-micro text-ink-600 hover:bg-line-soft transition-colors"
              >
                取消
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
