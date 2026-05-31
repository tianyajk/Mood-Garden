import type { TimeRange } from '@/hooks/useTimeline';
import { cn } from '@/utils/cn';

interface TimelineFilterProps {
  keyword: string;
  range: TimeRange;
  onKeyword: (kw: string) => void;
  onRange: (range: TimeRange) => void;
}

const RANGE_OPTIONS: Array<{ value: TimeRange; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'month', label: '本月' },
];

/** 搜索框 + 时间范围筛选 */
export function TimelineFilter({ keyword, range, onKeyword, onRange }: TimelineFilterProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-2 rounded-md border border-line-soft bg-bg-elevated px-4 py-2.5">
        <span className="text-ink-400" aria-hidden>
          🔍
        </span>
        <input
          value={keyword}
          onChange={(e) => onKeyword(e.target.value)}
          placeholder="搜索关键词…"
          className="w-full bg-transparent text-body text-ink-900 placeholder:text-ink-400 focus:outline-none"
          aria-label="搜索情绪记录"
        />
      </div>
      <div className="flex gap-2">
        {RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onRange(opt.value)}
            className={cn(
              'rounded-full px-4 py-2 text-caption transition-colors',
              range === opt.value
                ? 'bg-brand-green text-white'
                : 'border border-line-soft bg-bg-elevated text-ink-600 hover:bg-bg-sunken',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
