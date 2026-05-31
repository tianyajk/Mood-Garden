import { useMemo } from 'react';
import type { MoodRecord } from '@/types/mood';
import type { MeditationSession } from '@/types/meditation';
import type { EmotionKey } from '@/types/mood';
import { getEmotionConfig } from '@/config/emotions';

interface UseMonthlyReviewInput {
  records: MoodRecord[];
  meditationSessions: MeditationSession[];
  year: number;
  month: number; // 0-indexed
}

export function useMonthlyReview({ records, meditationSessions, year, month }: UseMonthlyReviewInput) {
  return useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthRecords = records.filter((r) => r.date.startsWith(prefix));
    const monthMeditations = meditationSessions.filter((s) => s.date.startsWith(prefix));

    const photoCount = monthRecords.filter((r) => r.image).length;
    const recordCount = monthRecords.length;
    const meditationCount = monthMeditations.length;
    const totalMeditationMinutes = Math.floor(
      monthMeditations.reduce((sum, s) => sum + s.elapsedSec, 0) / 60,
    );

    const emotionCounts = new Map<EmotionKey, number>();
    for (const r of monthRecords) {
      for (const e of r.emotions) {
        emotionCounts.set(e, (emotionCounts.get(e) || 0) + 1);
      }
    }
    let topEmotion: EmotionKey | null = null;
    let topCount = 0;
    for (const [key, count] of emotionCounts) {
      if (count > topCount) { topEmotion = key; topCount = count; }
    }

    const photos = monthRecords.filter((r) => r.image);

    return {
      photoCount,
      recordCount,
      meditationCount,
      totalMeditationMinutes,
      topEmotion: topEmotion ? getEmotionConfig(topEmotion) : null,
      photos,
      monthRecords,
    };
  }, [records, meditationSessions, year, month]);
}
