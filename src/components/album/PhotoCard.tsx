import { motion } from 'framer-motion';
import type { MoodRecord } from '@/types/mood';
import { getEmotionConfig } from '@/config/emotions';
import { formatShortDate } from '@/utils/date';

interface PhotoCardProps {
  record: MoodRecord;
  onClick: (record: MoodRecord) => void;
  variant?: 'grid' | 'masonry';
}

export function PhotoCard({ record, onClick, variant = 'grid' }: PhotoCardProps) {
  if (!record.image) return null;

  const emotion = record.emotions[0];
  const cfg = emotion ? getEmotionConfig(emotion) : null;

  if (variant === 'masonry') {
    return (
      <motion.button
        type="button"
        onClick={() => onClick(record)}
        className="w-full break-inside-avoid mb-3 rounded-2xl overflow-hidden paper-card hover:shadow-md transition-shadow text-left"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <img src={record.image} alt="" className="w-full object-cover" loading="lazy" />
        <div className="p-3 flex items-center gap-2">
          {cfg && <span>{cfg.emoji}</span>}
          <span className="text-caption text-ink-600">{formatShortDate(record.date)}</span>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={() => onClick(record)}
      className="aspect-square rounded-2xl overflow-hidden paper-card hover:shadow-md transition-shadow relative group"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <img src={record.image} alt="" className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/50 to-transparent p-3 flex items-center gap-2">
        {cfg && <span>{cfg.emoji}</span>}
        <span className="text-caption text-white">{formatShortDate(record.date)}</span>
      </div>
    </motion.button>
  );
}
