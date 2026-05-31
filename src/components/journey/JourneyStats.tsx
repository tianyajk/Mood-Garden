import { motion } from 'framer-motion';
import type { EmotionConfig } from '@/types/garden';

interface JourneyStatsProps {
  streakDays: number;
  totalRecordedDays: number;
  totalMeditationMinutes: number;
  topEmotion: EmotionConfig | null;
}

const tiles = [
  { key: 'streak', label: '连续记录', unit: '天', icon: '🔥' },
  { key: 'total', label: '累计记录', unit: '天', icon: '📖' },
  { key: 'meditation', label: '累计冥想', unit: '分钟', icon: '🧘' },
] as const;

export function JourneyStats({
  streakDays,
  totalRecordedDays,
  totalMeditationMinutes,
  topEmotion,
}: JourneyStatsProps) {
  const values: Record<string, number> = {
    streak: streakDays,
    total: totalRecordedDays,
    meditation: totalMeditationMinutes,
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {tiles.map((t, i) => (
        <motion.div
          key={t.key}
          className="paper-card flex flex-col items-center rounded-2xl px-2 py-4 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
        >
          <span className="text-lg mb-1">{t.icon}</span>
          <span className="text-h3 tabular-nums text-ink-900 font-medium">
            {values[t.key]}
          </span>
          <span className="text-micro text-ink-400">{t.unit}</span>
          <span className="text-micro text-ink-400/60 mt-0.5">{t.label}</span>
        </motion.div>
      ))}

      <motion.div
        className="paper-card flex flex-col items-center rounded-2xl px-2 py-4 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.5 }}
      >
        <span className="text-lg mb-1">😊</span>
        <span className="text-h3 text-ink-900 font-medium">
          {topEmotion?.emoji || '—'}
        </span>
        <span className="text-micro text-ink-400">{topEmotion?.label || '暂无'}</span>
        <span className="text-micro text-ink-400/60 mt-0.5">本月最多</span>
      </motion.div>
    </div>
  );
}
