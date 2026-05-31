import { motion, useReducedMotion } from 'framer-motion';
import type { TimerPhase } from '@/types/meditation';
import { formatClock } from '@/utils/time';

interface TimerDialState {
  remainingSec: number;
  progress: number; // 0–1 已完成比例
  phase: TimerPhase;
}

const SIZE = 280;
const STROKE = 6;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

/**
 * 计时表盘：SVG 环形进度 + 呼吸引导（running 时内圈 4s 缩放，对齐 4-6s 呼吸节律）。
 * 纯展示，所有状态由 useMeditationTimer 注入。
 */
export function TimerDial({ remainingSec, progress, phase }: TimerDialState) {
  const reduce = useReducedMotion();
  const breathing = phase === 'running' && !reduce;

  return (
    <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      {/* 呼吸光晕 */}
      <motion.div
        className="absolute rounded-full bg-brand-glow/40 blur-2xl"
        style={{ width: SIZE * 0.7, height: SIZE * 0.7 }}
        animate={breathing ? { scale: [1, 1.12, 1], opacity: [0.4, 0.7, 0.4] } : { scale: 1, opacity: 0.35 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 进度环 */}
      <svg width={SIZE} height={SIZE} className="absolute -rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={STROKE} />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          animate={{ strokeDashoffset: CIRC * (1 - progress) }}
          transition={{ duration: 0.3, ease: 'linear' }}
        />
      </svg>

      {/* 呼吸内圈 + 剩余时间 */}
      <motion.div
        className="glass flex h-44 w-44 flex-col items-center justify-center rounded-full"
        animate={breathing ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="font-display text-display tabular-nums text-white drop-shadow-sm">
          {formatClock(remainingSec)}
        </span>
        <span className="mt-1 text-caption text-white/70">{phaseHint(phase, breathing)}</span>
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
