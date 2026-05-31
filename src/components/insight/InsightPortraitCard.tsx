import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { AiInsight } from '@/types/ai';
import type { EmotionKey, MoodRecord } from '@/types/mood';
import { getEmotionConfig } from '@/config/emotions';

interface Props {
  insight: AiInsight;
  records: MoodRecord[];
}

export function InsightPortraitCard({ insight, records }: Props) {
  const topEmotions = useMemo(() => {
    const freq = new Map<EmotionKey, number>();
    for (const r of records) {
      for (const e of r.emotions) {
        freq.set(e, (freq.get(e) ?? 0) + 1);
      }
    }
    const total = [...freq.values()].reduce((s, n) => s + n, 0);
    return [...freq.entries()]
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([key, count]) => ({ key, count, pct: Math.round((count / total) * 100) }));
  }, [records]);

  return (
    <div className="paper-card rounded-2xl p-6 overflow-hidden">
      <p className="text-micro text-ink-400 mb-3 tracking-widest">情绪画像</p>
      <p className="text-body-lg text-ink-900 leading-relaxed">{insight.portrait}</p>

      {topEmotions.length > 0 && (
        <div className="mt-5 space-y-3">
          {topEmotions.map(({ key, pct }, i) => {
            const cfg = getEmotionConfig(key);
            return (
              <motion.div
                key={key}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <span className="text-sm w-5 text-center">{cfg.emoji}</span>
                <span className="text-caption text-ink-600 w-10 shrink-0">{cfg.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-bg-sunken overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: cfg.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-micro text-ink-400 w-8 text-right">{pct}%</span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
