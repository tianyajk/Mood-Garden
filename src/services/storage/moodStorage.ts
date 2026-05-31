import type { MoodRecord } from '@/types/mood';

/**
 * LocalStorage 读写 + 版本迁移（架构设计第五节 数据层）。
 * 存储结构：{ version, records }，便于未来字段演进时平滑迁移。
 */

const STORAGE_KEY = 'mood_garden_records';
const CURRENT_VERSION = 1;

interface StoredShape {
  version: number;
  records: MoodRecord[];
}

function isRecord(value: unknown): value is MoodRecord {
  if (typeof value !== 'object' || value === null) return false;
  const r = value as Partial<MoodRecord>;
  return (
    typeof r.id === 'string' &&
    typeof r.date === 'string' &&
    Array.isArray(r.emotions) &&
    typeof r.description === 'string' &&
    typeof r.createdAt === 'number'
  );
}

/** 把任意已存数据迁移到当前版本结构（容错坏数据） */
function migrate(raw: unknown): MoodRecord[] {
  if (typeof raw !== 'object' || raw === null) return [];
  const shape = raw as Partial<StoredShape>;
  const list = Array.isArray(shape.records) ? shape.records : [];
  return list.filter(isRecord);
}

/** 读取全部记录；解析失败返回空数组，绝不抛错中断启动 */
export function loadRecords(): MoodRecord[] {
  try {
    const text = localStorage.getItem(STORAGE_KEY);
    if (!text) return [];
    return migrate(JSON.parse(text) as unknown);
  } catch {
    return [];
  }
}

/** 覆盖写入全部记录 */
export function saveRecords(records: MoodRecord[]): void {
  try {
    const payload: StoredShape = { version: CURRENT_VERSION, records };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // 配额或隐私模式失败时静默；UI 由 hook 层兜底提示
  }
}
