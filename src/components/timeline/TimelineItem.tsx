import type { MoodRecord } from '@/types/mood';
import { getEmotionConfig } from '@/config/emotions';
import { formatShortDate } from '@/utils/date';

interface TimelineItemProps {
  record: MoodRecord;
  onClick: (record: MoodRecord) => void;
}

export function TimelineItem({ record, onClick }: TimelineItemProps) {
  const configs = record.emotions.map(getEmotionConfig);
  const emojis = configs.map((c) => c.emoji).join(' ');
  const labels = configs.map((c) => c.label).join('、');
  const primary = configs[0];

  return (
    <button
      type="button"
      onClick={() => onClick(record)}
      className="group relative mb-3 flex w-full items-start gap-4 rounded-xl px-4 py-3 text-left transition-colors hover:bg-[#FFFDF7]/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20"
    >
      <span className="mt-0.5 text-lg" aria-hidden>{emojis}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-caption text-ink-900 font-medium">{labels}</span>
          <span className="h-1 w-1 rounded-full bg-ink-400/40" />
          <span className="text-micro text-ink-400 tabular-nums">{formatShortDate(record.date)}</span>
        </div>
        {record.description && (
          <p className="mt-0.5 text-caption text-ink-600 line-clamp-1">{record.description}</p>
        )}
      </div>
      {primary && (
        <span
          className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: primary.color }}
        />
      )}
    </button>
  );
}
