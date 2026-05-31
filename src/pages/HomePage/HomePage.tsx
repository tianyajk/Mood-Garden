import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { duration, easing } from '@/config/theme';

export function HomePage() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const fadeItem = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: easing.gentle } },
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-paper-warm">
      <div className="absolute inset-0 bg-[#F5F0E8]" />

      <motion.div
        className="relative z-10 flex w-full max-w-[360px] flex-col items-center px-6 text-center"
        style={{ marginTop: '-8vh' }}
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2 } } }}
      >
        {/* Logo 呼吸 */}
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

        <motion.div className="mt-8 flex items-center gap-6" variants={fadeItem}>
          <button
            onClick={() => navigate('/timeline')}
            className="text-caption text-ink-400 transition-colors hover:text-ink-600"
          >
            情绪时间线
          </button>
        </motion.div>

        <motion.p className="mt-14 text-micro text-ink-400/60" variants={fadeItem}>
          每日记录，温柔对待自己
        </motion.p>
      </motion.div>
    </div>
  );
}
