import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { duration, easing } from '@/config/theme';

/** 首页：Logo + 标题 + 进入花园入口（页面只展示） */
export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sky-day">
      <div className="absolute inset-0 bg-white/10" />
      <motion.div
        className="relative z-10 flex w-full max-w-[420px] flex-col items-center px-6 text-center"
        style={{ marginTop: '-8vh' }}
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.2 } },
        }}
      >
        <motion.span
          className="text-6xl"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: duration.breathe + 1, repeat: Infinity, ease: 'easeInOut' }}
        >
          🌱
        </motion.span>

        <motion.h1
          className="font-display mt-6 text-display text-white drop-shadow-sm"
          variants={fadeItem}
        >
          Mood Garden
        </motion.h1>

        <motion.p className="font-display mt-3 italic text-body-lg text-white/90" variants={fadeItem}>
          记录情绪，种下属于自己的花。
        </motion.p>

        <motion.div className="mt-10" variants={fadeItem}>
          <Button variant="glass" size="lg" onClick={() => navigate('/garden')}>
            进入花园 →
          </Button>
        </motion.div>

        <motion.p className="mt-16 text-micro text-white/60" variants={fadeItem}>
          · · · v1.0 · · ·
        </motion.p>
      </motion.div>
    </div>
  );
}

const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: easing.gentle } },
};
