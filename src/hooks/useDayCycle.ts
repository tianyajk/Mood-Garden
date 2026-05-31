import { useEffect, useState } from 'react';
import type { TimeOfDay } from '@/types/garden';

/** 由本地时钟派生昼夜：6–17 白天 / 17–19 黄昏 / 其余 夜晚 */
function timeFromClock(now: Date = new Date()): TimeOfDay {
  const h = now.getHours();
  if (h >= 6 && h < 17) return 'day';
  if (h >= 17 && h < 19) return 'dusk';
  return 'night';
}

/**
 * 昼夜系统：基于真实时钟，每分钟刷新一次。
 * 情绪偏好的覆盖在 useGardenScene 中合成（emotion.timeOfDay 优先）。
 */
export function useDayCycle(): { timeOfDay: TimeOfDay } {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(() => timeFromClock());

  useEffect(() => {
    const id = window.setInterval(() => setTimeOfDay(timeFromClock()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return { timeOfDay };
}
