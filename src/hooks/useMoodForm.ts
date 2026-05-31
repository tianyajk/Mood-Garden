import { useCallback, useMemo, useState } from 'react';
import type { EmotionKey, MoodDraft } from '@/types/mood';
import { DESCRIPTION_MAX, clampDescription, validateDraft } from '@/utils/validators';

export function useMoodForm(initial?: Partial<MoodDraft>) {
  const [emotions, setEmotions] = useState<EmotionKey[]>(initial?.emotions ?? []);
  const [description, setDescription] = useState<string>(initial?.description ?? '');
  const [image, setImage] = useState<string | undefined>(initial?.image);

  const selectEmotion = useCallback((key: EmotionKey) => {
    setEmotions((prev) =>
      prev.includes(key) ? [] : [key],
    );
  }, []);

  const updateDescription = useCallback((text: string) => {
    setDescription(clampDescription(text));
  }, []);

  const reset = useCallback((next?: Partial<MoodDraft>) => {
    setEmotions(next?.emotions ?? []);
    setDescription(next?.description ?? '');
    setImage(next?.image);
  }, []);

  const draft: MoodDraft = useMemo(
    () => ({ emotions, description, image }),
    [emotions, description, image],
  );

  const validation = useMemo(() => validateDraft(draft), [draft]);

  return {
    emotions,
    description,
    image,
    draft,
    validation,
    charCount: description.length,
    charMax: DESCRIPTION_MAX,
    canSubmit: validation.valid,
    selectEmotion,
    updateDescription,
    setImage,
    reset,
  };
}
