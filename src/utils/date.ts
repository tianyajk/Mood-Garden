/** 日期纯函数工具 */

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/** 取本地日期的 YYYY-MM-DD（记录每天唯一键） */
export function toDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 解析 YYYY-MM-DD 为本地 Date（避免 UTC 偏移） */
export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** 中文长日期：2026年5月31日 · 周六 */
export function formatLongDate(key: string): string {
  const date = fromDateKey(key);
  const weekday = WEEKDAYS[date.getDay()];
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 · ${weekday}`;
}

/** 短日期：05.31 */
export function formatShortDate(key: string): string {
  const date = fromDateKey(key);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}.${d}`;
}

/** 月份分组键：2026年5月 */
export function formatMonthLabel(key: string): string {
  const date = fromDateKey(key);
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

/** 时间戳 → HH:MM */
export function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/** 是否为「本月」（用于时间轴筛选） */
export function isInCurrentMonth(key: string, now: Date = new Date()): boolean {
  const date = fromDateKey(key);
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}
