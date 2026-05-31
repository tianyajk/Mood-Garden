/** 冥想模块类型（与 mood 平行的独立持久化域，互不侵入） */

/** 背景音景标识，与 config/meditation.ts 对齐 */
export type AmbientKey = 'silent' | 'rain' | 'ocean' | 'forest' | 'stream';

/** 单次冥想会话（持久化单元，一天可多次） */
export interface MeditationSession {
  id: string; // uuid
  date: string; // YYYY-MM-DD（本地）
  plannedSec: number; // 设定时长（秒）
  elapsedSec: number; // 实际冥想时长（秒）
  completed: boolean; // 是否自然走完计时
  ambient: AmbientKey; // 本次所用音景
  createdAt: number; // 时间戳
}

/** 计时器运行态（hook 内状态机） */
export type TimerPhase = 'idle' | 'running' | 'paused' | 'finished';

/** 冥想统计派生值（由会话列表算出，不单独存储） */
export interface MeditationStatsData {
  totalSessions: number; // 累计次数
  totalMinutes: number; // 累计分钟（向下取整）
  streakDays: number; // 连续天数（含今天）
  todayMinutes: number; // 今日分钟
}
