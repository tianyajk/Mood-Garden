import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import type { MoodRecord } from '@/types/mood';
import { PhotoDetailModal } from '@/components/album/PhotoDetailModal';
import { useMoodRecords } from '@/hooks/useMoodRecords';
import { useMeditationRecords } from '@/hooks/useMeditationRecords';
import { useMonthlyReview } from '@/hooks/useMonthlyReview';
import { formatShortDate } from '@/utils/date';
import { getEmotionConfig } from '@/config/emotions';
import { duration, easing } from '@/config/theme';

export function MonthlyReviewPage() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { records } = useMoodRecords();
  const { sessions: meditationSessions } = useMeditationRecords();

  const now = new Date();
  const [year] = useState(now.getFullYear());
  const [month] = useState(now.getMonth());

  const review = useMonthlyReview({ records, meditationSessions, year, month });
  const [selected, setSelected] = useState<MoodRecord | null>(null);

  const monthLabel = `${year}年${month + 1}月`;

  const statCards = [
    { icon: '📷', label: '照片', value: review.photoCount, unit: '张' },
    { icon: '📝', label: '记录', value: review.recordCount, unit: '条' },
    { icon: '🧘', label: '冥想', value: review.meditationCount, unit: '次' },
  ];

  const fadeIn = {
    initial: reduce ? { opacity: 1 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration.slow, ease: easing.gentle },
  };

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="mx-auto max-w-[640px] px-5 py-8">
        <motion.header className="flex items-center justify-between mb-6" {...fadeIn}>
          <button
            onClick={() => navigate('/album')}
            className="flex items-center gap-1 rounded-xl bg-bg-sunken px-3 py-2 text-caption text-ink-600 hover:bg-line-soft hover:text-ink-900 transition-colors"
          >
            ← 返回
          </button>
          <h1 className="font-display text-h2 text-ink-900">{monthLabel} 回顾</h1>
          <div className="w-8" />
        </motion.header>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-2 mb-8"
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fadeIn.transition, delay: 0.1 }}
        >
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              className="paper-card rounded-2xl flex flex-col items-center py-4 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              <span className="text-xl mb-1">{s.icon}</span>
              <span className="text-h3 tabular-nums text-ink-900 font-medium">{s.value}</span>
              <span className="text-micro text-ink-400">{s.unit}</span>
            </motion.div>
          ))}

          {review.topEmotion && (
            <motion.div
              className="paper-card rounded-2xl col-span-3 flex items-center gap-4 p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
            >
              <span className="text-3xl">{review.topEmotion.emoji}</span>
              <div>
                <p className="text-caption text-ink-400">本月最常见情绪</p>
                <p className="text-body text-ink-900 font-medium">{review.topEmotion.label}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-caption text-ink-400">冥想</p>
                <p className="text-body text-ink-900 font-medium">{review.totalMeditationMinutes} 分钟</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Photo collage */}
        <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.2 }}>
          <h2 className="font-display text-h3 text-ink-900 mb-4">照片拼图</h2>
        </motion.div>

        {review.photos.length === 0 ? (
          <motion.div
            className="flex flex-col items-center gap-3 py-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-4xl">📷</span>
            <p className="text-body text-ink-400">本月还没有照片记录</p>
          </motion.div>
        ) : (
          <PhotoCollage photos={review.photos} onSelect={setSelected} reduce={reduce} />
        )}

        <div className="h-12" />
      </div>

      <PhotoDetailModal
        record={selected}
        meditationMinutes={selected ? meditationSessions
          .filter((s) => s.date === selected.date)
          .reduce((sum, s) => sum + Math.floor(s.elapsedSec / 60), 0) : 0}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

function PhotoCollage({
  photos,
  onSelect,
  reduce,
}: {
  photos: MoodRecord[];
  onSelect: (r: MoodRecord) => void;
  reduce: boolean | null;
}) {
  return (
    <div className="columns-2 sm:columns-3 gap-2">
      {photos.map((r, i) => {
        const cfg = r.emotions[0] ? getEmotionConfig(r.emotions[0]) : null;
        return r.image ? (
          <motion.button
            key={r.id}
            type="button"
            onClick={() => onSelect(r)}
            className="break-inside-avoid mb-2 rounded-xl overflow-hidden paper-card hover:shadow-md transition-shadow text-left w-full"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img src={r.image} alt="" className="w-full object-cover" loading="lazy" />
            <div className="p-2 flex items-center gap-2">
              {cfg && <span>{cfg.emoji}</span>}
              <span className="text-micro text-ink-400">{formatShortDate(r.date)}</span>
            </div>
          </motion.button>
        ) : null;
      })}
    </div>
  );
}
