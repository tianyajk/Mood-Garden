import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MoodRecord } from '@/types/mood';
import { Button } from '@/components/ui/Button';
import { TimelineFilter } from '@/components/timeline/TimelineFilter';
import { TimelineItem } from '@/components/timeline/TimelineItem';
import { RecordDetailModal } from '@/components/timeline/RecordDetailModal';
import { TimelineEmpty } from '@/pages/TimelinePage/TimelineEmpty';
import { useTimeline } from '@/hooks/useTimeline';
import { useMoodRecords } from '@/hooks/useMoodRecords';
import { deriveStage } from '@/config/growth';

/** 时间轴页：历史记录 + 搜索 + 筛选 + 详情（页面只组合） */
export function TimelinePage() {
  const navigate = useNavigate();
  const tl = useTimeline();
  const { records } = useMoodRecords();
  const [active, setActive] = useState<MoodRecord | null>(null);

  const recordedDays = useMemo(() => new Set(records.map((r) => r.date)).size, [records]);
  const stage = useMemo(() => deriveStage(recordedDays), [recordedDays]);

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-5 py-6">
      <header className="flex items-center gap-3">
        <Button variant="secondary" size="md" onClick={() => navigate('/')}>
          ← 首页
        </Button>
        <h1 className="font-display text-h1 text-ink-900">我的情绪旅程</h1>
      </header>

      <div className="mt-6">
        <TimelineFilter
          keyword={tl.keyword}
          range={tl.range}
          onKeyword={tl.setKeyword}
          onRange={tl.setRange}
        />
      </div>

      {tl.isEmpty && <TimelineEmpty variant="empty" onAction={() => navigate('/record')} />}
      {tl.noResult && <TimelineEmpty variant="no-result" />}

      <div className="mt-6 flex flex-col gap-8">
        {tl.groups.map((group) => (
          <section key={group.month}>
            <h2 className="mb-2 text-caption font-medium text-ink-600">{group.month}</h2>
            <div className="border-l-2 border-line-soft pl-3">
              {group.items.map((record) => (
                <TimelineItem key={record.id} record={record} onClick={setActive} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {!tl.isEmpty && (
        <p className="mt-10 text-center text-caption text-ink-400">
          · 已记录 {recordedDays} 天 · 当前：{stage.label} {stage.emoji} ·
        </p>
      )}

      <RecordDetailModal
        record={active}
        onClose={() => setActive(null)}
      />
    </div>
  );
}
