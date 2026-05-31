import { motion } from 'framer-motion';
import type { EmotionKey } from '@/types/mood';
import { getEmotionConfig } from '@/config/emotions';
import { useGardenStage } from '@/hooks/useGardenStage';

interface GardenPlaceholderProps {
  emotions: EmotionKey[];
}

/**
 * 2D 占位花园（Phase1）。Phase2 将由 garden/ Three.js 引擎替换此组件。
 * 这里仅用 emoji + 成长阶段表达「情绪 → 花园」的派生关系。
 */
export function GardenPlaceholder({ emotions }: GardenPlaceholderProps) {
  const { stage, recordedDays } = useGardenStage();
  const configs = emotions.map(getEmotionConfig);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex flex-wrap items-center justify-center gap-6">
        {configs.map((c, i) => (
          <motion.span
            key={c.key}
            className="text-6xl sm:text-7xl"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {c.emoji}
          </motion.span>
        ))}
      </div>

      <div className="glass rounded-full px-5 py-2 text-caption text-ink-900">
        {stage.emoji} {stage.label} · 已记录 {recordedDays} 天
      </div>

      <p className="max-w-sm text-caption text-white/70">
        （3D 花园将在 Phase2 由 Three.js 引擎呈现）
      </p>
    </div>
  );
}
