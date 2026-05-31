/** 时间纯函数工具（冥想计时显示） */

/** 秒 → mm:ss（如 605 → 10:05） */
export function formatClock(totalSec: number): string {
  const safe = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
