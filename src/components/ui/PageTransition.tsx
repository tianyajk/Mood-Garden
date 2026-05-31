import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { duration, easing } from '@/config/theme';

export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: duration.slow, ease: easing.gentle }}
    >
      {children}
    </motion.div>
  );
}
