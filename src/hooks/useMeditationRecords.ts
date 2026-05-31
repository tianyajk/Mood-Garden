import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AmbientKey, MeditationSession, MeditationStatsData } from '@/types/meditation';
import { loadSessions, saveSessions } from '@/services/storage/meditationStorage';
import { createId } from '@/utils/id';
import { toDateKey } from '@/utils/date';

/** 单次会话入参（无 id/date/createdAt，由 hook 补全） */
interface SessionInput {
  plannedSec: number;
  elapsedSec: number;
  completed: boolean;
  ambient: AmbientKey;
}

/** 连续天数：从今天往前数，逐日要求有会话，断了即止 */
function computeStreak(dates: Set<string>): number {
  let streak = 0;
  const cursor = new Date();
  // 若今天还没冥想，则从昨天起算（今天不计为断）
  if (!dates.has(toDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (dates.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/**
 * 冥想会话读写 + 统计派生。
 * 独立于 GardenContext 自管状态，仅与 meditationStorage 通信，零侵入情绪记录。
 */
export function useMeditationRecords() {
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // 启动 hydrate
  useEffect(() => {
    setSessions(loadSessions());
    setHydrated(true);
  }, []);

  // 变更后持久化（hydrate 前不写，避免覆盖）
  useEffect(() => {
    if (hydrated) saveSessions(sessions);
  }, [sessions, hydrated]);

  /** 追加一次会话（仅记录有效时长 > 0 的会话） */
  const addSession = useCallback((input: SessionInput): MeditationSession => {
    const session: MeditationSession = {
      id: createId(),
      date: toDateKey(),
      createdAt: Date.now(),
      ...input,
    };
    setSessions((prev) => [...prev, session]);
    return session;
  }, []);

  /** 统计派生值（随会话重算） */
  const stats = useMemo<MeditationStatsData>(() => {
    const todayKey = toDateKey();
    const totalSec = sessions.reduce((sum, s) => sum + s.elapsedSec, 0);
    const todaySec = sessions
      .filter((s) => s.date === todayKey)
      .reduce((sum, s) => sum + s.elapsedSec, 0);
    const dates = new Set(sessions.map((s) => s.date));
    return {
      totalSessions: sessions.length,
      totalMinutes: Math.floor(totalSec / 60),
      streakDays: computeStreak(dates),
      todayMinutes: Math.floor(todaySec / 60),
    };
  }, [sessions]);

  return { sessions, hydrated, addSession, stats };
}
