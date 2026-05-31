import { useMemo } from 'react';
import type { EmotionKey, MoodRecord } from '@/types/mood';
import type { MeditationSession } from '@/types/meditation';
import { toDateKey } from '@/utils/date';
import { getEmotionConfig } from '@/config/emotions';

export interface CalendarDay {
  date: string;        // YYYY-MM-DD
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isStreak: boolean;
  streakMilestone: number; // 0 | 7 | 30
  record: MoodRecord | null;
  meditationMinutes: number;
}

export interface DayDetail {
  date: string;
  record: MoodRecord | null;
  meditationMinutes: number;
  meditationSessions: MeditationSession[];
}

interface UseMoodJourneyInput {
  records: MoodRecord[];
  meditationSessions: MeditationSession[];
}

export function useMoodJourney({ records, meditationSessions }: UseMoodJourneyInput) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const todayKey = toDateKey(now);

  // Build lookup maps
  const recordByDate = useMemo(() => {
    const map = new Map<string, MoodRecord[]>();
    for (const r of records) {
      const list = map.get(r.date) || [];
      list.push(r);
      map.set(r.date, list);
    }
    return map;
  }, [records]);

  const meditationByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of meditationSessions) {
      map.set(s.date, (map.get(s.date) || 0) + Math.floor(s.elapsedSec / 60));
    }
    return map;
  }, [meditationSessions]);

  // Streak computation
  const { streakDays, streakDates } = useMemo(() => {
    const dates = new Set<string>();
    let days = 0;
    const cursor = new Date(now);
    // If today has no record, check from yesterday
    if (!recordByDate.has(toDateKey(cursor))) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (recordByDate.has(toDateKey(cursor))) {
      days++;
      dates.add(toDateKey(cursor));
      cursor.setDate(cursor.getDate() - 1);
    }
    return { streakDays: days, streakDates: dates };
  }, [recordByDate, now]);

  // Calendar grid
  const calendarDays = useMemo((): CalendarDay[] => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDow = firstDay.getDay(); // 0=Sun

    const cells: CalendarDay[] = [];

    // Previous month fill
    const prevLast = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDow - 1; i >= 0; i--) {
      const d = prevLast - i;
      const date = toDateKey(new Date(currentYear, currentMonth - 1, d));
      cells.push(buildCell(date, d, false, todayKey, streakDates, recordByDate, meditationByDate));
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const date = toDateKey(new Date(currentYear, currentMonth, d));
      cells.push(buildCell(date, d, true, todayKey, streakDates, recordByDate, meditationByDate));
    }

    // Next month fill to complete 6 rows
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const date = toDateKey(new Date(currentYear, currentMonth + 1, d));
      cells.push(buildCell(date, d, false, todayKey, streakDates, recordByDate, meditationByDate));
    }

    return cells;
  }, [currentYear, currentMonth, todayKey, streakDates, recordByDate, meditationByDate]);

  // Stats
  const stats = useMemo(() => {
    const uniqueDates = new Set(records.map((r) => r.date));
    const totalRecordedDays = uniqueDates.size;
    const totalMeditationMinutes = Math.floor(
      meditationSessions.reduce((sum, s) => sum + s.elapsedSec, 0) / 60,
    );

    // Most frequent emotion this month
    const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    const emotionCounts = new Map<EmotionKey, number>();
    for (const r of records) {
      if (!r.date.startsWith(monthPrefix)) continue;
      for (const e of r.emotions) {
        emotionCounts.set(e, (emotionCounts.get(e) || 0) + 1);
      }
    }
    let topEmotion: EmotionKey | null = null;
    let topCount = 0;
    for (const [key, count] of emotionCounts) {
      if (count > topCount) { topEmotion = key; topCount = count; }
    }

    return {
      streakDays,
      totalRecordedDays,
      totalMeditationMinutes,
      topEmotion: topEmotion ? getEmotionConfig(topEmotion) : null,
    };
  }, [records, meditationSessions, streakDays, currentYear, currentMonth]);

  // Day detail for a specific date
  const getDayDetail = (date: string): DayDetail => {
    const dayRecords = recordByDate.get(date) || [];
    const dayMins = meditationByDate.get(date) || 0;
    const daySessions = meditationSessions.filter((s) => s.date === date);
    return {
      date,
      record: dayRecords[dayRecords.length - 1] || null,
      meditationMinutes: dayMins,
      meditationSessions: daySessions,
    };
  };

  return {
    currentYear,
    currentMonth,
    calendarDays,
    stats,
    streakDates,
    getDayDetail,
  };
}

function buildCell(
  date: string,
  dayOfMonth: number,
  isCurrentMonth: boolean,
  todayKey: string,
  streakDates: Set<string>,
  recordByDate: Map<string, MoodRecord[]>,
  meditationByDate: Map<string, number>,
): CalendarDay {
  const isToday = date === todayKey;
  const isStreak = streakDates.has(date);
  const streakMilestone = isStreak && streakDates.size >= 30 ? 30 : isStreak && streakDates.size >= 7 ? 7 : 0;
  const dayRecords = recordByDate.get(date) || [];
  return {
    date,
    dayOfMonth,
    isCurrentMonth,
    isToday,
    isStreak,
    streakMilestone,
    record: dayRecords[dayRecords.length - 1] || null,
    meditationMinutes: meditationByDate.get(date) || 0,
  };
}
