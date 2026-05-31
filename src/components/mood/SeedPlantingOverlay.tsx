import { AnimatePresence, motion } from 'framer-motion';
import { springSoft } from '@/config/theme';

/** 提交链式动效：种子落地（按钮提交后短暂呈现，再进入花园看生长） */
export function SeedPlantingOverlay({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[65] flex items-center justify-center bg-bg-base/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="flex flex-col items-center gap-3">
            <motion.span
              className="text-6xl"
              initial={{ y: -80, scale: 0.6, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              transition={springSoft}
            >
              🌱
            </motion.span>
            <motion.span
              className="text-caption text-ink-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              正在种下今天…
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
