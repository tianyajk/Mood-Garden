import { useCallback, useState } from 'react';
import type { MoodDraft } from '@/types/mood';
import { analyzeEmotion } from '@/services/ai/aiClient';
import { useMoodRecords } from './useMoodRecords';
import { toDateKey } from '@/utils/date';

interface SubmitResult {
  ok: boolean;
  degraded: boolean; // AI 是否走了降级（mock）
}

/**
 * 记录提交编排（复杂异步流程放 hook，页面只展示）：
 * AI 分析（service 层已兜底降级）→ 写入记录（含持久化）。
 */
export function useMoodSubmit() {
  const { addRecord } = useMoodRecords();
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(
    async (draft: MoodDraft, date: string = toDateKey()): Promise<SubmitResult> => {
      setSubmitting(true);
      try {
        const result = await analyzeEmotion(draft.emotions, draft.description);
        addRecord(date, draft, result.data);
        return { ok: true, degraded: result.source === 'mock' };
      } finally {
        setSubmitting(false);
      }
    },
    [addRecord],
  );

  return { submit, submitting };
}
