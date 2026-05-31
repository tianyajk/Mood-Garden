import type { MeditationStatsData } from '@/types/meditation';

interface MeditationStatsProps {
  stats: MeditationStatsData;
}

/** 冥想统计四宫格（玻璃卡）：连续天数 / 今日 / 累计次数 / 累计分钟 */
export function MeditationStats({ stats }: MeditationStatsProps) {
  const tiles = [
    { label: '连续天数', value: stats.streakDays, unit: '天' },
    { label: '今日冥想', value: stats.todayMinutes, unit: '分钟' },
    { label: '累计次数', value: stats.totalSessions, unit: '次' },
    { label: '累计时长', value: stats.totalMinutes, unit: '分钟' },
  ];

  return (
    <div className="grid w-full max-w-[420px] grid-cols-4 gap-2">
      {tiles.map((t) => (
        <div
          key={t.label}
          className="glass flex flex-col items-center rounded-md px-2 py-3 text-center text-white"
        >
          <span className="font-display text-h2 tabular-nums leading-none">{t.value}</span>
          <span className="mt-1 text-micro text-white/70">{t.unit}</span>
          <span className="mt-0.5 text-micro text-white/60">{t.label}</span>
        </div>
      ))}
    </div>
  );
}
