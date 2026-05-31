import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { FloatingParticles } from '@/components/ui/FloatingParticles';
import { duration, easing } from '@/config/theme';

/** 首页：双核心入口（记录情绪 / 开始冥想）+ 次级入口（花园 / 时间线） */
export function HomePage() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sky-day">
      <div className="absolute inset-0 bg-white/10" />
      <FloatingParticles />
      <motion.div
        className="relative z-10 flex w-full max-w-[420px] flex-col items-center px-6 text-center"
        style={{ marginTop: '-6vh' }}
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18 } } }}
      >
        <motion.span
          className="text-6xl"
          animate={reduce ? undefined : { scale: [1, 1.03, 1] }}
          transition={{ duration: duration.breathe + 1, repeat: Infinity, ease: 'easeInOut' }}
        >
          🌱
        </motion.span>

        <motion.h1 className="font-display mt-6 text-display text-white drop-shadow-sm" variants={fadeItem}>
          Mood Garden
        </motion.h1>

        <motion.p className="font-display mt-3 italic text-body-lg text-white/90" variants={fadeItem}>
          记录情绪，安放此刻。
        </motion.p>

        <motion.div className="mt-10 flex w-full flex-col gap-3" variants={fadeItem}>
          <Button variant="glass" size="lg" onClick={() => navigate('/record')}>
            📝 记录情绪
          </Button>
          <Button variant="glass" size="lg" onClick={() => navigate('/meditate')}>
            🧘 开始冥想
          </Button>
        </motion.div>

        <motion.div className="mt-6 flex items-center gap-6 text-caption text-white/75" variants={fadeItem}>
          <button onClick={() => navigate('/garden')} className="transition-colors hover:text-white">
            我的花园
          </button>
          <span className="text-white/30">·</span>
          <button onClick={() => navigate('/timeline')} className="transition-colors hover:text-white">
            情绪时间线
          </button>
        </motion.div>

        <motion.p className="mt-14 text-micro text-white/60" variants={fadeItem}>
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
