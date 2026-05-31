import { useCallback, useMemo } from 'react';
import type { AiAnalysis } from '@/types/ai';
import type { MoodDraft, MoodRecord } from '@/types/mood';
import { useGardenContext } from '@/context/GardenContext';
import { createId } from '@/utils/id';
import { toDateKey } from '@/utils/date';

/**
 * 记录增删读 + 持久化编排（持久化副作用在 GardenContext 内统一处理）。
 * 页面/其他 hook 通过此处读写记录，不直接碰 Context dispatch。
 */
export function useMoodRecords() {
  const { state, dispatch } = useGardenContext();

  /** 全部记录，按创建时间倒序（新→旧） */
  const records = useMemo(
    () => [...state.records].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [state.records],
  );

  /** 取某天全部记录 */
  const getRecordsByDate = useCallback(
    (date: string): MoodRecord[] => state.records.filter((r) => r.date === date),
    [state.records],
  );

  /** 今天的全部记录（可能为空） */
  const todayRecords = useMemo(
    () => state.records.filter((r) => r.date === toDateKey()),
    [state.records],
  );

  /** 今天最新一条（便利字段） */
  const latestTodayRecord = useMemo<MoodRecord | undefined>(
    () => todayRecords[todayRecords.length - 1],
    [todayRecords],
  );

  /** 新增一条记录（一天可多条，不再覆盖旧记录） */
  const addRecord = useCallback(
    (date: string, draft: MoodDraft, aiAnalysis: AiAnalysis | null): MoodRecord => {
      const record: MoodRecord = {
        id: createId(),
        date,
        emotions: draft.emotions,
        description: draft.description,
        image: draft.image,
        aiAnalysis,
        createdAt: Date.now(),
      };
      dispatch({ type: 'ADD_RECORD', payload: record });
      return record;
    },
    [dispatch],
  );

  return {
    records,
    todayRecords,
    latestTodayRecord,
    hydrated: state.hydrated,
    getRecordsByDate,
    addRecord,
  };
}
