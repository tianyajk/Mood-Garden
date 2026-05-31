import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import type { MoodRecord } from '@/types/mood';
import { AlbumGrid } from '@/components/album/AlbumGrid';
import { AlbumMasonry } from '@/components/album/AlbumMasonry';
import { AlbumTimeline } from '@/components/album/AlbumTimeline';
import { PhotoDetailModal } from '@/components/album/PhotoDetailModal';
import { useMoodRecords } from '@/hooks/useMoodRecords';
import { useMeditationRecords } from '@/hooks/useMeditationRecords';
import { duration, easing } from '@/config/theme';

type ViewMode = 'grid' | 'masonry' | 'timeline';

const MODES: Array<{ key: ViewMode; label: string; icon: string }> = [
  { key: 'grid', label: '网格', icon: '⊞' },
  { key: 'masonry', label: '瀑布流', icon: '▥' },
  { key: 'timeline', label: '时间轴', icon: '⊟' },
];

export function MoodAlbumPage() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { records } = useMoodRecords();
  const { sessions: meditationSessions } = useMeditationRecords();

  const [mode, setMode] = useState<ViewMode>('grid');
  const [selected, setSelected] = useState<MoodRecord | null>(null);

  const recordsDesc = useMemo(
    () => [...records].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [records],
  );

  const meditationByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of meditationSessions) {
      map.set(s.date, (map.get(s.date) || 0) + Math.floor(s.elapsedSec / 60));
    }
    return map;
  }, [meditationSessions]);

  const totalPhotos = records.filter((r) => r.image).length;

  const ViewComponent = {
    grid: AlbumGrid,
    masonry: AlbumMasonry,
    timeline: AlbumTimeline,
  }[mode];

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="mx-auto max-w-[640px] px-5 py-8">
        <motion.header
          className="flex items-center justify-between mb-6"
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.slow, ease: easing.gentle }}
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 rounded-xl bg-bg-sunken px-3 py-2 text-caption text-ink-600 hover:bg-line-soft hover:text-ink-900 transition-colors"
          >
            ← 返回
          </button>
          <h1 className="font-display text-h2 text-ink-900">回忆相册</h1>
          <span className="text-caption text-ink-400">{totalPhotos} 张</span>
        </motion.header>

        {/* View mode switcher */}
        <motion.div
          className="flex gap-2 mb-6"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              className={`flex items-center gap-1 rounded-xl px-4 py-2 text-caption transition-colors ${
                mode === m.key
                  ? 'bg-ink-900 text-white'
                  : 'bg-bg-sunken text-ink-600 hover:bg-line-soft'
              }`}
            >
              <span>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </motion.div>

        {/* Monthly review link */}
        <motion.div
          className="mb-6"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <button
            onClick={() => navigate('/review')}
            className="w-full paper-card rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div className="text-left">
                <p className="text-caption text-ink-900 font-medium">月度回顾</p>
                <p className="text-micro text-ink-400">查看本月情绪统计与照片拼图</p>
              </div>
            </div>
            <span className="text-ink-400">→</span>
          </button>
        </motion.div>

        {/* Photo view */}
        <ViewComponent records={recordsDesc} onClick={setSelected} />

        <div className="h-12" />
      </div>

      <PhotoDetailModal
        record={selected}
        meditationMinutes={selected ? (meditationByDate.get(selected.date) || 0) : 0}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
