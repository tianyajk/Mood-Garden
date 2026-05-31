import { motion } from 'framer-motion';
import { getEmotionConfig } from '@/config/emotions';
import type { CalendarDay } from '@/hooks/useMoodJourney';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

interface MoodCalendarProps {
  days: CalendarDay[];
  currentYear: number;
  currentMonth: number;
  onSelectDay: (day: CalendarDay) => void;
}

export function MoodCalendar({ days, currentYear, currentMonth, onSelectDay }: MoodCalendarProps) {
  const monthLabel = `${currentYear}年${currentMonth + 1}月`;

  return (
    <div>
      <h2 className="font-display text-h3 text-ink-900 mb-4">{monthLabel}</h2>

      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-micro text-ink-400 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <motion.button
            key={day.date}
            type="button"
            onClick={() => day.isCurrentMonth && onSelectDay(day)}
            disabled={!day.isCurrentMonth}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.01, duration: 0.3 }}
            whileHover={day.isCurrentMonth ? { scale: 1.08 } : undefined}
            whileTap={day.isCurrentMonth ? { scale: 0.95 } : undefined}
            className={calendarCellClass(day)}
          >
            {day.streakMilestone >= 30 && (
              <span className="absolute -top-1 -right-1 text-xs">🏆</span>
            )}
            {day.streakMilestone >= 7 && day.streakMilestone < 30 && (
              <span className="absolute -top-1 -right-1 text-xs">🔥</span>
            )}

            <span className={dayNumberClass(day)}>{day.dayOfMonth}</span>

            {day.record && (
              <span className="text-base leading-none mt-0.5">
                {day.record.emotions.map((e) => getEmotionConfig(e).emoji).join('')}
              </span>
            )}

            {day.meditationMinutes > 0 && (
              <span className="text-micro text-ink-400 mt-0.5">
                🧘 {day.meditationMinutes}m
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function calendarCellClass(day: CalendarDay): string {
  const base =
    'relative flex flex-col items-center justify-start rounded-xl p-1.5 transition-all duration-200 aspect-[5/6]';

  if (!day.isCurrentMonth) return `${base} opacity-0 pointer-events-none`;

  if (day.isToday) {
    return `${base} paper-card border-brand-warm/30 ring-1 ring-brand-warm/10`;
  }

  if (day.isStreak && day.record) {
    const glow = day.streakMilestone >= 7
      ? 'shadow-[0_0_8px_rgba(194,139,78,0.2)]'
      : 'shadow-[0_0_4px_rgba(194,139,78,0.1)]';
    return `${base} paper-card ${glow}`;
  }

  if (day.record) {
    return `${base} paper-card hover:shadow-md`;
  }

  return `${base} border border-transparent hover:bg-bg-sunken/50`;
}

function dayNumberClass(day: CalendarDay): string {
  const base = 'text-caption tabular-nums';
  if (day.isToday) return `${base} text-brand-warm font-semibold`;
  if (day.isCurrentMonth && day.record) return `${base} text-ink-900 font-medium`;
  if (day.isCurrentMonth) return `${base} text-ink-400`;
  return `${base} text-ink-400/25`;
}
