import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { JourneyStats } from '@/components/journey/JourneyStats';
import { MoodCalendar } from '@/components/journey/MoodCalendar';
import { DayDetailModal } from '@/components/journey/DayDetailModal';
import { useMoodJourney, type CalendarDay, type DayDetail } from '@/hooks/useMoodJourney';
import { useMoodRecords } from '@/hooks/useMoodRecords';
import { useMeditationRecords } from '@/hooks/useMeditationRecords';
import { duration, easing } from '@/config/theme';

export function MoodJourneyPage() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { records } = useMoodRecords();
  const { sessions: meditationSessions } = useMeditationRecords();

  const { currentYear, currentMonth, calendarDays, stats, getDayDetail } =
    useMoodJourney({ records, meditationSessions });

  const [selectedDay, setSelectedDay] = useState<DayDetail | null>(null);

  const handleSelectDay = (day: CalendarDay) => {
    setSelectedDay(getDayDetail(day.date));
  };

  const fadeIn = {
    initial: reduce ? { opacity: 1 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration.slow, ease: easing.gentle },
  };

  return (
    <div className="relative min-h-screen bg-bg-base">
      <div className="mx-auto max-w-[480px] px-5 py-8">
        <motion.header className="flex items-center justify-between mb-6" {...fadeIn}>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 rounded-xl bg-bg-sunken px-3 py-2 text-caption text-ink-600 hover:bg-line-soft hover:text-ink-900 transition-colors"
            aria-label="返回首页"
          >
            ← 返回
          </button>
          <h1 className="font-display text-h2 text-ink-900">情绪轨迹</h1>
          <div className="w-8" />
        </motion.header>

        <motion.div
          className="mb-8"
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fadeIn.transition, delay: 0.1 }}
        >
          <JourneyStats
            streakDays={stats.streakDays}
            totalRecordedDays={stats.totalRecordedDays}
            totalMeditationMinutes={stats.totalMeditationMinutes}
            topEmotion={stats.topEmotion}
          />
        </motion.div>

        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fadeIn.transition, delay: 0.2 }}
        >
          <MoodCalendar
            days={calendarDays}
            currentYear={currentYear}
            currentMonth={currentMonth}
            onSelectDay={handleSelectDay}
          />
        </motion.div>

        {stats.totalRecordedDays === 0 && (
          <motion.div
            className="mt-12 flex flex-col items-center gap-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-5xl">🌱</span>
            <p className="text-body text-ink-400">
              开始记录今天的情绪，<br />见证自己的成长轨迹。
            </p>
            <button
              onClick={() => navigate('/record')}
              className="mt-2 rounded-xl bg-brand-warm text-white px-6 py-3 text-caption hover:bg-brand-warm-deep transition-colors"
            >
              记录今天的情绪
            </button>
          </motion.div>
        )}

        <div className="h-12" />
      </div>

      <DayDetailModal
        open={selectedDay !== null}
        onClose={() => setSelectedDay(null)}
        date={selectedDay?.date || ''}
        record={selectedDay?.record || null}
        meditationMinutes={selectedDay?.meditationMinutes || 0}
        meditationSessions={selectedDay?.meditationSessions || []}
      />
    </div>
  );
}
