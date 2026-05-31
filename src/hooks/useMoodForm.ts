import { useCallback, useMemo, useState } from 'react';
import type { EmotionKey, MoodDraft } from '@/types/mood';
import { DESCRIPTION_MAX, clampDescription, validateDraft } from '@/utils/validators';

/**
 * 情绪记录表单状态 + 校验（页面只展示，逻辑在此）。
 * 支持单选/多选切换，描述字数兜底。
 */
export function useMoodForm(initial?: Partial<MoodDraft>) {
  const [emotions, setEmotions] = useState<EmotionKey[]>(initial?.emotions ?? []);
  const [description, setDescription] = useState<string>(initial?.description ?? '');

  /** 点选/取消某情绪（多选叠加） */
  const toggleEmotion = useCallback((key: EmotionKey) => {
    setEmotions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }, []);

  /** 更新描述（自动截断到上限） */
  const updateDescription = useCallback((text: string) => {
    setDescription(clampDescription(text));
  }, []);

  /** 重置表单 */
  const reset = useCallback((next?: Partial<MoodDraft>) => {
    setEmotions(next?.emotions ?? []);
    setDescription(next?.description ?? '');
  }, []);

  const draft: MoodDraft = useMemo(
    () => ({ emotions, description }),
    [emotions, description],
  );

  const validation = useMemo(() => validateDraft(draft), [draft]);

  return {
    emotions,
    description,
    draft,
    validation,
    charCount: description.length,
    charMax: DESCRIPTION_MAX,
    canSubmit: validation.valid,
    toggleEmotion,
    updateDescription,
    reset,
  };
}
