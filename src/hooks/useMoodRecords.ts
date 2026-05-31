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

  /** 全部记录，按日期倒序（新→旧） */
  const records = useMemo(
    () => [...state.records].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [state.records],
  );

  /** 取某天记录 */
  const getRecordByDate = useCallback(
    (date: string): MoodRecord | undefined => state.records.find((r) => r.date === date),
    [state.records],
  );

  /** 今天的记录（可能不存在） */
  const todayRecord = useMemo(
    () => state.records.find((r) => r.date === toDateKey()),
    [state.records],
  );

  /** 新增某天记录（同一天已存在则改走 update） */
  const addRecord = useCallback(
    (date: string, draft: MoodDraft, aiAnalysis: AiAnalysis | null): MoodRecord => {
      const existing = state.records.find((r) => r.date === date);
      if (existing) {
        const updated: MoodRecord = {
          ...existing,
          emotions: draft.emotions,
          description: draft.description,
          aiAnalysis,
        };
        dispatch({ type: 'UPDATE_RECORD', payload: updated });
        return updated;
      }
      const record: MoodRecord = {
        id: createId(),
        date,
        emotions: draft.emotions,
        description: draft.description,
        aiAnalysis,
        createdAt: Date.now(),
      };
      dispatch({ type: 'ADD_RECORD', payload: record });
      return record;
    },
    [state.records, dispatch],
  );

  return {
    records,
    todayRecord,
    hydrated: state.hydrated,
    getRecordByDate,
    addRecord,
  };
}
