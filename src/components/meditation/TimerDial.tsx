import { motion, useReducedMotion } from 'framer-motion';
import type { TimerPhase } from '@/types/meditation';
import { formatClock } from '@/utils/time';

interface TimerDialState {
  remainingSec: number;
  progress: number;
  phase: TimerPhase;
}

const SIZE = 280;
const STROKE = 5;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

export function TimerDial({ remainingSec, progress, phase }: TimerDialState) {
  const reduce = useReducedMotion();
  const breathing = phase === 'running' && !reduce;

  return (
    <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      <motion.div
        className="absolute rounded-full bg-amber-200/20 blur-3xl"
        style={{ width: SIZE * 0.7, height: SIZE * 0.7 }}
        animate={breathing ? { scale: [1, 1.12, 1], opacity: [0.3, 0.6, 0.3] } : { scale: 1, opacity: 0.25 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg width={SIZE} height={SIZE} className="absolute -rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={STROKE} />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="#D4A84B"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          animate={{ strokeDashoffset: CIRC * (1 - progress) }}
          transition={{ duration: 0.3, ease: 'linear' }}
        />
      </svg>

      <motion.div
        className="flex h-44 w-44 flex-col items-center justify-center rounded-full bg-white/8 border border-white/10"
        animate={breathing ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="font-display text-[44px] tabular-nums text-white leading-none">
          {formatClock(remainingSec)}
        </span>
        <span className="mt-2 text-caption text-white/50">{phaseHint(phase, breathing)}</span>
      </motion.div>
    </div>
  );
}

function phaseHint(phase: TimerPhase, breathing: boolean): string {
  if (phase === 'paused') return '已暂停';
  if (phase === 'finished') return '已完成';
  if (breathing) return '跟随呼吸';
  if (phase === 'running') return '专注此刻';
  return '准备好了吗';
}
