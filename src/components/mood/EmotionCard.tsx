import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import type { EmotionConfig } from '@/types/garden';
import { springSoft } from '@/config/theme';
import { cn } from '@/utils/cn';

interface EmotionCardProps {
  config: EmotionConfig;
  selected: boolean;
  onSelect: (key: EmotionConfig['key']) => void;
}

export function EmotionCard({ config, selected, onSelect }: EmotionCardProps) {
  const cardStyle: CSSProperties = selected
    ? { borderColor: config.color, backgroundColor: config.bgColor }
    : {};

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(config.key)}
      aria-pressed={selected}
      aria-label={config.label}
      whileTap={{ scale: 0.96 }}
      animate={{ y: selected ? -2 : 0 }}
      transition={springSoft}
      className={cn(
        'relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-3',
        'rounded-xl border transition-all duration-400',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
        selected
          ? 'shadow-sm'
          : 'border-line-soft bg-[#FFFDF7] hover:border-ink-400/30',
      )}
      style={cardStyle}
    >
      <span className="text-4xl" aria-hidden>
        {config.emoji}
      </span>
      <span className={cn('text-body font-medium', selected ? 'text-ink-900' : 'text-ink-600')}>
        {config.label}
      </span>
    </motion.button>
  );
}
