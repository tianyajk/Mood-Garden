import type { MoodRecord } from '@/types/mood';
import type { MeditationSession } from '@/types/meditation';
import { loadRecords, saveRecords } from './moodStorage';
import { loadSessions, saveSessions } from './meditationStorage';

/**
 * 全量备份导出 / 导入（纯本地 JSON 文件）。
 * 设计原则：
 * - 只复用现有 load/save，不绕过类型校验
 * - 导入后必须 reload，让 GardenContext 重新从存储水合
 * - 文件结构带 app/version 标识，便于未来字段演进时兼容旧备份
 */

const APP_TAG = 'mood-garden';
const BACKUP_VERSION = 1;
const WALLPAPER_KEY = 'mood_garden_wallpaper';

export interface BackupFile {
  app: typeof APP_TAG;
  version: number;
  exportedAt: string;
  data: {
    moodRecords: MoodRecord[];
    meditationRecords: MeditationSession[];
    wallpaper: string | null;
  };
}

export interface BackupStats {
  moodCount: number;
  meditationCount: number;
  hasWallpaper: boolean;
}

export interface ImportResult {
  moodAdded: number;
  moodUpdated: number;
  meditationAdded: number;
  meditationUpdated: number;
  wallpaperReplaced: boolean;
}

function loadWallpaper(): string | null {
  try { return localStorage.getItem(WALLPAPER_KEY); }
  catch { return null; }
}

function saveWallpaper(base64: string | null): void {
  try {
    if (base64) localStorage.setItem(WALLPAPER_KEY, base64);
    else localStorage.removeItem(WALLPAPER_KEY);
  } catch {
    // 配额满或隐私模式：保持现状
  }
}

/** 当前本地数据概览（用于 UI 展示"将导出 N 条记录"） */
export function getBackupStats(): BackupStats {
  return {
    moodCount: loadRecords().length,
    meditationCount: loadSessions().length,
    hasWallpaper: !!loadWallpaper(),
  };
}

/** 构造一份完整备份对象 */
export function buildBackup(): BackupFile {
  return {
    app: APP_TAG,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      moodRecords: loadRecords(),
      meditationRecords: loadSessions(),
      wallpaper: loadWallpaper(),
    },
  };
}

/** 触发浏览器下载备份 JSON 文件 */
export function downloadBackup(): void {
  const backup = buildBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mood-garden-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** 解析并严格校验上传的备份文件 */
export async function parseBackupFile(file: File): Promise<BackupFile> {
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('文件不是有效的 JSON');
  }
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('备份文件结构不正确');
  }
  const obj = parsed as Partial<BackupFile>;
  if (obj.app !== APP_TAG) {
    throw new Error('不是 Mood Garden 的备份文件');
  }
  if (typeof obj.version !== 'number') {
    throw new Error('备份文件缺少版本字段');
  }
  if (obj.version > BACKUP_VERSION) {
    throw new Error('备份文件版本高于当前应用，请升级后再试');
  }
  if (typeof obj.data !== 'object' || obj.data === null) {
    throw new Error('备份文件缺少数据字段');
  }
  const data = obj.data as Partial<BackupFile['data']>;
  return {
    app: APP_TAG,
    version: obj.version,
    exportedAt: typeof obj.exportedAt === 'string' ? obj.exportedAt : '',
    data: {
      moodRecords: Array.isArray(data.moodRecords) ? (data.moodRecords as MoodRecord[]) : [],
      meditationRecords: Array.isArray(data.meditationRecords)
        ? (data.meditationRecords as MeditationSession[])
        : [],
      wallpaper: typeof data.wallpaper === 'string' ? data.wallpaper : null,
    },
  };
}

/**
 * 合并模式：保留现有数据，按 date/id 去重，createdAt 较新的覆盖较旧的。
 * 壁纸：仅在当前为空且备份有时采用，避免误覆盖用户当前选择的壁纸。
 */
export function importMerge(backup: BackupFile): ImportResult {
  const existingMoods = loadRecords();
  const moodMap = new Map<string, MoodRecord>(existingMoods.map((r) => [r.id, r]));
  let moodAdded = 0;
  let moodUpdated = 0;
  for (const incoming of backup.data.moodRecords) {
    const existing = moodMap.get(incoming.id);
    if (!existing) {
      moodMap.set(incoming.id, incoming);
      moodAdded++;
    } else if (incoming.createdAt > existing.createdAt) {
      moodMap.set(incoming.id, incoming);
      moodUpdated++;
    }
  }
  saveRecords(Array.from(moodMap.values()).sort((a, b) => b.createdAt - a.createdAt));

  const existingSessions = loadSessions();
  const sessionMap = new Map<string, MeditationSession>(existingSessions.map((s) => [s.id, s]));
  let meditationAdded = 0;
  let meditationUpdated = 0;
  for (const incoming of backup.data.meditationRecords) {
    const existing = sessionMap.get(incoming.id);
    if (!existing) {
      sessionMap.set(incoming.id, incoming);
      meditationAdded++;
    } else if (incoming.createdAt > existing.createdAt) {
      sessionMap.set(incoming.id, incoming);
      meditationUpdated++;
    }
  }
  saveSessions(Array.from(sessionMap.values()).sort((a, b) => b.createdAt - a.createdAt));

  let wallpaperReplaced = false;
  if (backup.data.wallpaper && !loadWallpaper()) {
    saveWallpaper(backup.data.wallpaper);
    wallpaperReplaced = true;
  }

  return { moodAdded, moodUpdated, meditationAdded, meditationUpdated, wallpaperReplaced };
}

/** 替换模式：直接以备份内容覆盖本地所有相关数据 */
export function importReplace(backup: BackupFile): ImportResult {
  saveRecords(backup.data.moodRecords);
  saveSessions(backup.data.meditationRecords);
  saveWallpaper(backup.data.wallpaper);
  return {
    moodAdded: backup.data.moodRecords.length,
    moodUpdated: 0,
    meditationAdded: backup.data.meditationRecords.length,
    meditationUpdated: 0,
    wallpaperReplaced: !!backup.data.wallpaper,
  };
}
