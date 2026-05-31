import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import type { EmotionConfig } from '@/types/garden';
import { springSoft } from '@/config/theme';
import { cn } from '@/utils/cn';

interface EmotionCardProps {
  config: EmotionConfig;
  selected: boolean;
  onToggle: (key: EmotionConfig['key']) => void;
}

/** 单个情绪卡（受控选中态）：选中时上浮 + 情绪色描边 + 微光 + 角标 */
export function EmotionCard({ config, selected, onToggle }: EmotionCardProps) {
  // 选中微光 + 情绪色 focus 外环（无障碍）
  const cardStyle: CSSProperties = selected
    ? { borderColor: config.color, backgroundColor: config.bgColor, boxShadow: `0 0 24px ${config.color}55` }
    : {};
  (cardStyle as Record<string, string>)['--tw-ring-color'] = config.color;

  return (
    <motion.button
      type="button"
      onClick={() => onToggle(config.key)}
      aria-pressed={selected}
      aria-label={config.label}
      whileTap={{ scale: 0.96 }}
      animate={{ y: selected ? -4 : 0 }}
      transition={springSoft}
      className={cn(
        'relative flex aspect-square w-full flex-col items-center justify-center gap-1.5',
        'rounded-md border-2 transition-all duration-300',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        selected ? 'shadow-md' : 'border-line-soft bg-bg-elevated hover:bg-bg-sunken',
      )}
      style={cardStyle}
    >
      {selected && (
        <span
          className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-micro text-white"
          style={{ backgroundColor: config.color }}
        >
          ◉
        </span>
      )}
      <span className="text-3xl" aria-hidden>
        {config.emoji}
      </span>
      <span className="text-caption text-ink-900">{config.label}</span>
    </motion.button>
  );
}
