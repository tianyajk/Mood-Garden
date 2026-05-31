import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { duration, easing } from '@/config/theme';

/** 页面转场：fade + 轻微上浮，无硬切；减少动态时仅保留 opacity */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: duration.slow, ease: easing.gentle }}
    >
      {children}
    </motion.div>
  );
}
