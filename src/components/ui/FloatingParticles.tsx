import { motion, useReducedMotion } from 'framer-motion';

interface Blob {
  size: number;
  left: string;
  top: string;
  drift: number;
  dur: number;
}

/** 首页氛围：缓慢漂浮的光晕云团。减少动态时不渲染 */
const BLOBS: Blob[] = [
  { size: 160, left: '12%', top: '18%', drift: 24, dur: 13 },
  { size: 120, left: '74%', top: '22%', drift: -20, dur: 16 },
  { size: 200, left: '58%', top: '62%', drift: 18, dur: 18 },
  { size: 90, left: '24%', top: '68%', drift: -16, dur: 14 },
  { size: 70, left: '84%', top: '54%', drift: 14, dur: 11 },
];

export function FloatingParticles() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/25 blur-2xl"
          style={{ width: b.size, height: b.size, left: b.left, top: b.top }}
          animate={{ y: [0, -22, 0], x: [0, b.drift, 0], opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
