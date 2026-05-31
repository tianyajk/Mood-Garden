/**
 * 动效 token（缓动 / 时长），Framer Motion 与 CSS 共用。
 * 对齐 视觉设计.md 第五节「慢、柔、有机」。
 */

export const easing = {
  /** UI 通用 */
  soft: [0.4, 0, 0.2, 1] as const,
  /** 卡片 / 转场 */
  gentle: [0.25, 0.1, 0.25, 1] as const,
} as const;

export const duration = {
  fast: 0.2,
  base: 0.3,
  slow: 0.5,
  breathe: 5,
} as const;

/** Framer spring：选中、弹入 */
export const springSoft = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 18,
};

/** 常用淡入上浮过渡（页面 / 卡片入场） */
export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: duration.slow, ease: easing.gentle },
};
