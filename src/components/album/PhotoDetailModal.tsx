import { motion, AnimatePresence } from 'framer-motion';
import type { MoodRecord } from '@/types/mood';
import { getEmotionConfig } from '@/config/emotions';
import { formatLongDate } from '@/utils/date';
import { AiAnalysisCard } from '@/components/feedback/AiAnalysisCard';

interface PhotoDetailModalProps {
  record: MoodRecord | null;
  meditationMinutes?: number;
  onClose: () => void;
}

export function PhotoDetailModal({ record, meditationMinutes = 0, onClose }: PhotoDetailModalProps) {
  const cfg = record?.emotions[0] ? getEmotionConfig(record.emotions[0]) : null;

  return (
    <AnimatePresence>
      {record && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-ink-900/20 backdrop-blur-sm" />

          <motion.div
            className="relative z-10 w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl paper-card p-0 shadow-lg"
            initial={{ y: '30%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '30%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            {record.image && (
              <img
                src={record.image}
                alt=""
                className="w-full max-h-64 object-cover rounded-t-3xl"
              />
            )}

            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-h2 text-ink-900">
                  {formatLongDate(record.date)}
                </h2>
                {cfg && (
                  <span className="text-3xl">{cfg.emoji}</span>
                )}
              </div>

              {cfg && (
                <span
                  className="self-start rounded-xl px-3 py-1.5 text-caption"
                  style={{ backgroundColor: cfg.bgColor, color: cfg.color }}
                >
                  {cfg.emoji} {cfg.label}
                </span>
              )}

              {record.description && (
                <p className="text-body text-ink-900 leading-relaxed">{record.description}</p>
              )}

              {record.aiAnalysis && (
                <AiAnalysisCard analysis={record.aiAnalysis} accentColor={cfg?.color} />
              )}

              {meditationMinutes > 0 && (
                <p className="text-caption text-ink-400">🧘 冥想 {meditationMinutes} 分钟</p>
              )}

              <button
                onClick={onClose}
                className="w-full rounded-xl bg-bg-sunken py-3 text-caption text-ink-600 hover:bg-line-soft transition-colors"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
