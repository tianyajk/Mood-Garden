import { motion, AnimatePresence } from 'framer-motion';
import { getEmotionConfig } from '@/config/emotions';
import { formatLongDate } from '@/utils/date';
import type { AiAnalysis } from '@/types/ai';
import type { MeditationSession } from '@/types/meditation';
import type { MoodRecord } from '@/types/mood';

interface DayDetailModalProps {
  open: boolean;
  onClose: () => void;
  date: string;
  record: MoodRecord | null;
  meditationMinutes: number;
  meditationSessions: MeditationSession[];
}

export function DayDetailModal({
  open,
  onClose,
  date,
  record,
  meditationMinutes,
  meditationSessions,
}: DayDetailModalProps) {
  return (
    <AnimatePresence>
      {open && (
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
            className="relative z-10 w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl paper-card p-6 pb-10 sm:pb-6 shadow-lg"
            initial={{ y: '30%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '30%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line-soft sm:hidden" />

            <h2 className="font-display text-h2 text-ink-900 mb-4">
              {formatLongDate(date)}
            </h2>

            {!record && (
              <div className="flex flex-col items-center gap-3 py-8">
                <span className="text-4xl">🌱</span>
                <p className="text-body text-ink-400">这天还没有记录</p>
              </div>
            )}

            {record && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  {record.emotions.map((e) => {
                    const cfg = getEmotionConfig(e);
                    return (
                      <span
                        key={e}
                        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-caption"
                        style={{ backgroundColor: cfg.bgColor, color: cfg.color }}
                      >
                        {cfg.emoji} {cfg.label}
                      </span>
                    );
                  })}
                </div>

                {record.description && (
                  <div>
                    <h3 className="text-micro font-medium text-ink-400 uppercase tracking-wider mb-2">
                      日记
                    </h3>
                    <p className="text-body text-ink-900 leading-relaxed">
                      {record.description}
                    </p>
                  </div>
                )}

                {record.aiAnalysis && <AiInsight analysis={record.aiAnalysis} />}

                {(meditationMinutes > 0 || meditationSessions.length > 0) && (
                  <div>
                    <h3 className="text-micro font-medium text-ink-400 uppercase tracking-wider mb-2">
                      冥想
                    </h3>
                    <p className="text-body text-ink-600">
                      {meditationSessions.filter((s) => s.completed).length > 0
                        ? `完成了 ${meditationMinutes} 分钟冥想`
                        : `冥想 ${meditationMinutes} 分钟`}
                    </p>
                    {meditationSessions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {meditationSessions.map((s) => (
                          <span
                            key={s.id}
                            className="rounded-lg bg-bg-sunken px-2.5 py-1 text-caption text-ink-600"
                          >
                            🧘 {Math.floor(s.elapsedSec / 60)}m
                            {s.completed ? ' 完成' : ' 提前结束'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-bg-sunken py-3 text-caption text-ink-600 hover:bg-line-soft transition-colors"
            >
              关闭
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AiInsight({ analysis }: { analysis: AiAnalysis }) {
  return (
    <div>
      <h3 className="text-micro font-medium text-ink-400 uppercase tracking-wider mb-2">
        AI 洞察
      </h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {analysis.keywords.map((kw) => (
          <span
            key={kw}
            className="rounded-lg bg-bg-sunken px-2.5 py-1 text-caption text-ink-600"
          >
            {kw}
          </span>
        ))}
      </div>
      <p className="text-body text-ink-700 leading-relaxed">{analysis.feedback}</p>
    </div>
  );
}
