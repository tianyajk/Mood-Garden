import { useState, useMemo } from 'react';
import type { MoodRecord } from '@/types/mood';

export type InsightTab = 'week' | 'month' | 'all';

function cutoffDateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

export function useInsightPeriods(records: MoodRecord[]) {
  const [tab, setTab] = useState<InsightTab>('week');

  const weekRecords = useMemo(
    () => records.filter((r) => r.date >= cutoffDateStr(7)),
    [records],
  );

  const monthRecords = useMemo(
    () => records.filter((r) => r.date >= cutoffDateStr(30)),
    [records],
  );

  return { tab, setTab, weekRecords, monthRecords };
}
