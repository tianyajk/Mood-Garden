import type { MeditationSession } from '@/types/meditation';

/**
 * 冥想会话 LocalStorage 读写 + 版本迁移。
 * 结构 { version, sessions }，与 moodStorage 同模式，互不干扰各用独立 key。
 */

const STORAGE_KEY = 'mood_garden_meditation';
const CURRENT_VERSION = 1;

interface StoredShape {
  version: number;
  sessions: MeditationSession[];
}

function isSession(value: unknown): value is MeditationSession {
  if (typeof value !== 'object' || value === null) return false;
  const s = value as Partial<MeditationSession>;
  return (
    typeof s.id === 'string' &&
    typeof s.date === 'string' &&
    typeof s.plannedSec === 'number' &&
    typeof s.elapsedSec === 'number' &&
    typeof s.completed === 'boolean' &&
    typeof s.ambient === 'string' &&
    typeof s.createdAt === 'number'
  );
}

/** 迁移任意已存数据到当前结构（容错坏数据） */
function migrate(raw: unknown): MeditationSession[] {
  if (typeof raw !== 'object' || raw === null) return [];
  const shape = raw as Partial<StoredShape>;
  const list = Array.isArray(shape.sessions) ? shape.sessions : [];
  return list.filter(isSession);
}

/** 读取全部会话；失败返回空数组，绝不抛错 */
export function loadSessions(): MeditationSession[] {
  try {
    const text = localStorage.getItem(STORAGE_KEY);
    if (!text) return [];
    return migrate(JSON.parse(text) as unknown);
  } catch {
    return [];
  }
}

/** 覆盖写入全部会话 */
export function saveSessions(sessions: MeditationSession[]): void {
  try {
    const payload: StoredShape = { version: CURRENT_VERSION, sessions };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // 配额 / 隐私模式失败时静默
  }
}
