import { useMemo, useState } from 'react';
import type { MoodRecord } from '@/types/mood';
import { formatMonthLabel, isInCurrentMonth } from '@/utils/date';
import { getEmotionConfig } from '@/config/emotions';
import { useMoodRecords } from './useMoodRecords';

/** 时间范围筛选选项 */
export type TimeRange = 'all' | 'month';

/** 按月分组的时间轴数据块 */
export interface TimelineGroup {
  month: string; // 2026年5月
  items: MoodRecord[];
}

/**
 * 时间轴搜索 / 筛选 / 排序 / 月份分组（页面只展示）。
 * 搜索命中：描述、情绪中文名、AI 关键词。
 */
export function useTimeline() {
  const { records } = useMoodRecords(); // 已倒序
  const [keyword, setKeyword] = useState('');
  const [range, setRange] = useState<TimeRange>('all');

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return records.filter((r) => {
      if (range === 'month' && !isInCurrentMonth(r.date)) return false;
      if (!kw) return true;
      const haystack = [
        r.description,
        ...r.emotions.map((e) => getEmotionConfig(e).label),
        ...(r.aiAnalysis?.keywords ?? []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(kw);
    });
  }, [records, keyword, range]);

  /** 按月分组（filtered 已倒序，分组内保持倒序） */
  const groups = useMemo<TimelineGroup[]>(() => {
    const map = new Map<string, MoodRecord[]>();
    for (const r of filtered) {
      const month = formatMonthLabel(r.date);
      const bucket = map.get(month);
      if (bucket) {
        bucket.push(r);
      } else {
        map.set(month, [r]);
      }
    }
    return Array.from(map, ([month, items]) => ({ month, items }));
  }, [filtered]);

  return {
    keyword,
    setKeyword,
    range,
    setRange,
    groups,
    total: records.length,
    matchedCount: filtered.length,
    isEmpty: records.length === 0,
    noResult: records.length > 0 && filtered.length === 0,
  };
}
