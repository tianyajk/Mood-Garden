import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { HomePhotoCard } from '@/components/album/HomePhotoCard';
import { useMoodRecords } from '@/hooks/useMoodRecords';
import { useWallpaper, compressImage } from '@/hooks/useWallpaper';
import { useToast } from '@/components/ui/Toast';
import { duration, easing } from '@/config/theme';

export function HomePage() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { todayRecords } = useMoodRecords();
  const { wallpaper, set, remove } = useWallpaper();
  const { notify } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const todayWithPhoto = todayRecords.find((r) => r.image);

  const handleFile = async (file: File) => {
    setProcessing(true);
    setMenuOpen(false);
    try {
      const base64 = await compressImage(file);
      const ok = set(base64);
      if (ok) {
        notify('壁纸已更新');
      } else {
        notify('壁纸设置失败，请尝试更小的图片', 'warning');
      }
    } catch {
      notify('图片处理失败，请重试', 'warning');
    } finally {
      setProcessing(false);
    }
  };

  const fadeItem = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: easing.gentle } },
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-paper-warm">
      <div
        className="absolute inset-0 home-overlay"
        style={{ backgroundColor: wallpaper ? 'rgba(245, 240, 232, 0.35)' : '#F5F0E8' }}
      />

      {/* Wallpaper button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="h-10 w-10 rounded-xl bg-white/60 backdrop-blur-sm border border-line-soft flex items-center justify-center text-lg hover:bg-white/80 transition-colors shadow-sm disabled:opacity-50"
          aria-label="更换壁纸"
          disabled={processing}
        >
          {processing ? '⏳' : '🖼️'}
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="absolute right-0 top-12 paper-card rounded-2xl p-3 flex flex-col gap-2 min-w-[160px]"
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <button
                onClick={() => inputRef.current?.click()}
                disabled={processing}
                className="text-caption text-ink-700 hover:text-ink-900 transition-colors text-left px-2 py-1 disabled:opacity-50"
              >
                🎨 选择壁纸
              </button>
              {wallpaper && (
                <button
                  onClick={() => { remove(); setMenuOpen(false); }}
                  className="text-caption text-ink-400 hover:text-danger transition-colors text-left px-2 py-1"
                >
                  ✕ 移除壁纸
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </div>

      <motion.div
        className="relative z-10 flex w-full max-w-[360px] flex-col items-center px-6 text-center"
        style={{ marginTop: '-8vh' }}
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2 } } }}
      >
        <motion.div
          className="text-6xl select-none"
          animate={reduce ? undefined : { scale: [1, 1.03, 1] }}
          transition={{ duration: duration.breathe, repeat: Infinity, ease: 'easeInOut' }}
        >
          📝
        </motion.div>

        <motion.h1 className="font-display mt-8 text-display text-ink-900" variants={fadeItem}>
          MoodGarden
        </motion.h1>

        <motion.p
          className="font-display mt-2 italic text-body-lg text-ink-600"
          variants={fadeItem}
        >
          记录情绪，安放此刻
        </motion.p>

        <motion.div className="mt-12 flex w-full flex-col gap-3" variants={fadeItem}>
          <Button variant="primary" size="lg" onClick={() => navigate('/record')}>
            记录情绪
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate('/meditate')}>
            开始冥想
          </Button>
        </motion.div>

        {todayWithPhoto && (
          <motion.div className="w-full mt-6" variants={fadeItem}>
            <HomePhotoCard
              record={todayWithPhoto}
              onClick={() => navigate('/album')}
            />
          </motion.div>
        )}

        <motion.div className="mt-8 flex items-center gap-6" variants={fadeItem}>
          <button
            onClick={() => navigate('/journey')}
            className="text-caption text-ink-400 transition-colors hover:text-ink-600"
          >
            情绪轨迹
          </button>
          <span className="text-ink-200">·</span>
          <button
            onClick={() => navigate('/album')}
            className="text-caption text-ink-400 transition-colors hover:text-ink-600"
          >
            回忆相册
          </button>
          <span className="text-ink-200">·</span>
          <button
            onClick={() => navigate('/timeline')}
            className="text-caption text-ink-400 transition-colors hover:text-ink-600"
          >
            时间线
          </button>
        </motion.div>

        <motion.p className="mt-14 text-micro text-ink-400/60" variants={fadeItem}>
          每日记录，温柔对待自己
        </motion.p>
      </motion.div>
    </div>
  );
}
