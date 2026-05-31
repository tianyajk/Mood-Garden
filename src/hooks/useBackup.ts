import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import {
  downloadBackup,
  getBackupStats,
  importMerge,
  importReplace,
  parseBackupFile,
  type BackupFile,
  type BackupStats,
  type ImportResult,
} from '@/services/storage/backup';

export type ImportMode = 'merge' | 'replace';

interface Preview {
  backup: BackupFile;
  fileName: string;
}

/**
 * 备份导出/导入业务编排（toast + 文件解析 + 二次确认）。
 * 导入成功后 reload 整个页面，让 GardenContext 等从存储重新水合，
 * 避免内存中的旧 state 反向覆盖我们刚写入的数据。
 */
export function useBackup() {
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [stats, setStats] = useState<BackupStats>(() => getBackupStats());

  const refreshStats = useCallback(() => setStats(getBackupStats()), []);

  const exportNow = useCallback(() => {
    try {
      downloadBackup();
      notify('已导出备份文件', 'success');
    } catch {
      notify('导出失败，请重试', 'warning');
    }
  }, [notify]);

  const stagePreview = useCallback(async (file: File) => {
    setBusy(true);
    try {
      const backup = await parseBackupFile(file);
      setPreview({ backup, fileName: file.name });
    } catch (e) {
      const msg = e instanceof Error ? e.message : '文件解析失败';
      notify(msg, 'warning');
    } finally {
      setBusy(false);
    }
  }, [notify]);

  const cancelPreview = useCallback(() => setPreview(null), []);

  const confirmImport = useCallback((mode: ImportMode): ImportResult | null => {
    if (!preview) return null;
    try {
      const result = mode === 'merge'
        ? importMerge(preview.backup)
        : importReplace(preview.backup);
      const tip = mode === 'merge'
        ? `合并完成：新增 ${result.moodAdded} 条 · 更新 ${result.moodUpdated} 条`
        : `已替换：${result.moodAdded} 条情绪 · ${result.meditationAdded} 次冥想`;
      notify(`${tip}，即将刷新…`, 'success');
      setPreview(null);
      // 让 GardenContext 等从存储重新水合
      window.setTimeout(() => window.location.reload(), 900);
      return result;
    } catch {
      notify('导入失败，请重试', 'warning');
      return null;
    }
  }, [preview, notify]);

  return {
    stats,
    refreshStats,
    exportNow,
    busy,
    preview,
    stagePreview,
    cancelPreview,
    confirmImport,
  };
}
