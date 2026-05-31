export const easing = {
  soft: [0.4, 0, 0.2, 1] as const,
  gentle: [0.25, 0.1, 0.25, 1] as const,
} as const;

export const duration = {
  fast: 0.25,
  base: 0.4,
  slow: 0.6,
  breathe: 6,
} as const;

export const springSoft = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 20,
};

export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: duration.slow, ease: easing.gentle },
};
