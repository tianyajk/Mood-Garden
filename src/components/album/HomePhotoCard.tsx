import { motion } from 'framer-motion';
import type { MoodRecord } from '@/types/mood';
import { getEmotionConfig } from '@/config/emotions';

interface HomePhotoCardProps {
  record: MoodRecord;
  onClick: () => void;
}

export function HomePhotoCard({ record, onClick }: HomePhotoCardProps) {
  if (!record.image) return null;

  const cfg = record.emotions[0] ? getEmotionConfig(record.emotions[0]) : null;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl overflow-hidden paper-card hover:shadow-md transition-shadow text-left"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <img src={record.image} alt="" className="w-full h-44 object-cover" />
      <div className="p-4 flex items-center justify-between">
        <div>
          <p className="text-caption text-ink-900 font-medium">今日照片</p>
          <p className="text-micro text-ink-400 mt-0.5">{record.description?.slice(0, 30) || '记录此刻'}</p>
        </div>
        {cfg && <span className="text-2xl">{cfg.emoji}</span>}
      </div>
    </motion.button>
  );
}
