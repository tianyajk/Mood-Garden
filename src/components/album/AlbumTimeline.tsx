import { motion } from 'framer-motion';
import type { MoodRecord } from '@/types/mood';
import { getEmotionConfig } from '@/config/emotions';
import { formatShortDate } from '@/utils/date';

interface AlbumTimelineProps {
  records: MoodRecord[];
  onClick: (record: MoodRecord) => void;
}

export function AlbumTimeline({ records, onClick }: AlbumTimelineProps) {
  const withImages = records.filter((r) => r.image);

  if (withImages.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="text-4xl">📷</span>
        <p className="text-body text-ink-400">还没有照片记录</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {withImages.map((r, i) => {
        const cfg = r.emotions[0] ? getEmotionConfig(r.emotions[0]) : null;
        return (
          <motion.button
            key={r.id}
            type="button"
            onClick={() => onClick(r)}
            className="flex gap-4 items-start text-left group"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.4 }}
          >
            <div className="flex flex-col items-center shrink-0">
              <span className="text-lg">{cfg?.emoji || '📷'}</span>
              <div className="w-px flex-1 bg-line-soft my-1 group-last:opacity-0" />
            </div>
            <div className="flex-1 pb-6">
              <div className="rounded-2xl overflow-hidden paper-card hover:shadow-md transition-shadow">
                {r.image && (
                  <img src={r.image} alt="" className="w-full h-48 object-cover" loading="lazy" />
                )}
                <div className="p-3">
                  <span className="text-caption text-ink-400">{formatShortDate(r.date)}</span>
                  {r.description && (
                    <p className="mt-1 text-caption text-ink-700 line-clamp-2">{r.description}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
