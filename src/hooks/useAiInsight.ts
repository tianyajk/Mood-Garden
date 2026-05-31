import { useState, useEffect, useCallback, useMemo } from 'react';
import type { AiInsight } from '@/types/ai';
import { analyzePersonalInsight } from '@/services/ai/aiClient';
import { toDateKey } from '@/utils/date';
import { useMoodRecords } from './useMoodRecords';
import { useMeditationRecords } from './useMeditationRecords';

const CACHE_KEY = 'mood_ai_insight';
export const MIN_RECORDS_FOR_INSIGHT = 3;

function computeStreakDays(records: { date: string }[]): number {
  const dates = new Set(records.map((r) => r.date));
  let days = 0;
  const cursor = new Date();
  if (!dates.has(toDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (dates.has(toDateKey(cursor))) {
    days++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return days;
}

export function useAiInsight() {
  const { records } = useMoodRecords();
  const { sessions } = useMeditationRecords();
  const [insight, setInsight] = useState<AiInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [degraded, setDegraded] = useState(false);
  const [cacheHydrated, setCacheHydrated] = useState(false);

  const meditationMinutes = useMemo(
    () => sessions.reduce((sum, s) => sum + Math.floor(s.elapsedSec / 60), 0),
    [sessions],
  );

  const streakDays = useMemo(() => computeStreakDays(records), [records]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) setInsight(JSON.parse(raw) as AiInsight);
    } catch {
      // ignore corrupt cache
    }
    setCacheHydrated(true);
  }, []);

  const generate = useCallback(async () => {
    if (records.length < MIN_RECORDS_FOR_INSIGHT || loading) return;
    setLoading(true);
    try {
      const result = await analyzePersonalInsight(records, meditationMinutes, streakDays);
      setInsight(result.data);
      setDegraded(result.source === 'mock');
      localStorage.setItem(CACHE_KEY, JSON.stringify(result.data));
    } finally {
      setLoading(false);
    }
  }, [records, meditationMinutes, streakDays, loading]);

  // 首次加载：缓存水合完成后，若无缓存且数据充足则自动生成
  useEffect(() => {
    if (cacheHydrated && records.length >= MIN_RECORDS_FOR_INSIGHT && !insight && !loading) {
      void generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheHydrated]);

  const hasEnoughData = records.length >= MIN_RECORDS_FOR_INSIGHT;
  // 记录数与上次分析时不同则认为数据已更新
  const isStale = !!insight && insight.recordCount !== records.length;

  return {
    insight,
    loading,
    degraded,
    generate,
    hasEnoughData,
    isStale,
    cacheHydrated,
    recordCount: records.length,
    minRecords: MIN_RECORDS_FOR_INSIGHT,
  };
}
