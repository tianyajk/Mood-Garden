import { useCallback, useEffect, useRef, useState } from 'react';
import type { TimerPhase } from '@/types/meditation';

interface UseMeditationTimerOptions {
  /** 自然走完计时回调（携带最终实际时长，单位秒） */
  onFinish?: (elapsedSec: number) => void;
}

/**
 * 冥想计时状态机：idle → running ⇄ paused → finished。
 * 用时间戳累计（非逐秒累加）避免后台节流导致的漂移；只读 elapsed/remaining 由秒级 tick 刷新。
 */
export function useMeditationTimer(initialSec: number, options: UseMeditationTimerOptions = {}) {
  const { onFinish } = options;

  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [plannedSec, setPlannedSec] = useState(initialSec);
  const [elapsedSec, setElapsedSec] = useState(0);

  const accumulatedRef = useRef(0); // 本段开始前已累计的秒数
  const startedAtRef = useRef(0); // 当前 running 段的起点时间戳
  const intervalRef = useRef<number | null>(null);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 卸载清理
  useEffect(() => clearTick, [clearTick]);

  const tick = useCallback(() => {
    const now = Date.now();
    const elapsed = accumulatedRef.current + (now - startedAtRef.current) / 1000;
    if (elapsed >= plannedSec) {
      clearTick();
      accumulatedRef.current = plannedSec;
      setElapsedSec(plannedSec);
      setPhase('finished');
      onFinishRef.current?.(plannedSec);
      return;
    }
    setElapsedSec(elapsed);
  }, [plannedSec, clearTick]);

  const runFrom = useCallback(() => {
    startedAtRef.current = Date.now();
    clearTick();
    intervalRef.current = window.setInterval(tick, 250);
    setPhase('running');
  }, [tick, clearTick]);

  /** 开始（从 idle） */
  const start = useCallback(() => {
    accumulatedRef.current = 0;
    setElapsedSec(0);
    runFrom();
  }, [runFrom]);

  /** 暂停 */
  const pause = useCallback(() => {
    accumulatedRef.current += (Date.now() - startedAtRef.current) / 1000;
    clearTick();
    setPhase('paused');
  }, [clearTick]);

  /** 继续（从 paused） */
  const resume = useCallback(() => {
    runFrom();
  }, [runFrom]);

  /** 重置回 idle（携带当前累计，供页面决定是否记录半途会话） */
  const reset = useCallback(() => {
    clearTick();
    accumulatedRef.current = 0;
    startedAtRef.current = 0;
    setElapsedSec(0);
    setPhase('idle');
  }, [clearTick]);

  /** idle 态调整时长（运行中不可改） */
  const changeDuration = useCallback(
    (sec: number) => {
      if (phase === 'running' || phase === 'paused') return;
      setPlannedSec(sec);
      setElapsedSec(0);
      accumulatedRef.current = 0;
      setPhase('idle');
    },
    [phase],
  );

  const remainingSec = Math.max(0, Math.ceil(plannedSec - elapsedSec));
  const progress = plannedSec > 0 ? Math.min(1, elapsedSec / plannedSec) : 0;

  return {
    phase,
    plannedSec,
    elapsedSec,
    remainingSec,
    progress,
    start,
    pause,
    resume,
    reset,
    changeDuration,
  };
}
