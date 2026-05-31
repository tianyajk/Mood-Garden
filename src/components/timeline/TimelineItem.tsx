import type { MoodRecord } from '@/types/mood';
import { getEmotionConfig } from '@/config/emotions';
import { formatShortDate } from '@/utils/date';

interface TimelineItemProps {
  record: MoodRecord;
  onClick: (record: MoodRecord) => void;
}

/** 时间线单条目：情绪 emoji + 日期 + 情绪名 + 描述摘要 */
export function TimelineItem({ record, onClick }: TimelineItemProps) {
  const configs = record.emotions.map(getEmotionConfig);
  const emojis = configs.map((c) => c.emoji).join(' ');
  const labels = configs.map((c) => c.label).join(' ');

  return (
    <button
      type="button"
      onClick={() => onClick(record)}
      className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left transition-colors hover:bg-bg-sunken focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
    >
      <span className="text-xl" aria-hidden>
        {emojis}
      </span>
      <span className="w-12 shrink-0 text-caption tabular-nums text-ink-600">
        {formatShortDate(record.date)}
      </span>
      <span className="w-20 shrink-0 text-caption text-ink-900">{labels}</span>
      <span className="flex-1 truncate text-caption text-ink-400">
        {record.description || '—'}
      </span>
      <span className="shrink-0 text-ink-400">›</span>
    </button>
  );
}
