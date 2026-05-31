import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import type { MoodRecord } from '@/types/mood';
import { TimelineFilter } from '@/components/timeline/TimelineFilter';
import { TimelineItem } from '@/components/timeline/TimelineItem';
import { RecordDetailModal } from '@/components/timeline/RecordDetailModal';
import { TimelineEmpty } from '@/pages/TimelinePage/TimelineEmpty';
import { useTimeline } from '@/hooks/useTimeline';
import { useMoodRecords } from '@/hooks/useMoodRecords';
import { deriveStage } from '@/config/growth';
import { duration, easing } from '@/config/theme';

export function TimelinePage() {
  const navigate = useNavigate();
  const tl = useTimeline();
  const { records, deleteRecord, removeImage } = useMoodRecords();
  const [active, setActive] = useState<MoodRecord | null>(null);
  const reduce = useReducedMotion();

  const recordedDays = useMemo(() => new Set(records.map((r) => r.date)).size, [records]);
  const stage = useMemo(() => deriveStage(recordedDays), [recordedDays]);

  const fadeItem = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: easing.gentle } },
  };

  return (
    <div className="mx-auto min-h-screen max-w-[480px] px-5 py-8 bg-bg-base">
      {/* Header */}
      <motion.header
        className="flex items-center gap-4"
        variants={fadeItem}
        initial="hidden"
        animate="show"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 rounded-xl bg-bg-sunken px-3 py-2 text-caption text-ink-600 hover:bg-line-soft hover:text-ink-900 transition-colors"
          aria-label="返回首页"
        >
          ← 返回
        </button>
        <h1 className="font-display text-h2 text-ink-900">情绪旅程</h1>
      </motion.header>

      {/* Filter */}
      <motion.div
        className="mt-6"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: duration.slow, ease: easing.gentle, delay: 0.1 }}
      >
        <TimelineFilter
          keyword={tl.keyword}
          range={tl.range}
          onKeyword={tl.setKeyword}
          onRange={tl.setRange}
        />
      </motion.div>

      {/* Empty states */}
      {tl.isEmpty && <TimelineEmpty variant="empty" onAction={() => navigate('/record')} />}
      {tl.noResult && <TimelineEmpty variant="no-result" />}

      {/* Timeline */}
      <div className="mt-8 flex flex-col">
        {tl.groups.map((group) => (
          <section key={group.month} className="mb-8">
            <h2 className="font-display text-caption font-medium text-ink-600 mb-3">{group.month}</h2>
            <div className="border-l border-line-soft pl-2">
              {group.items.map((record, i) => (
                <motion.div
                  key={record.id}
                  initial={reduce ? { opacity: 1 } : { opacity: 0, x: -8 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                  transition={{ duration: duration.slow, delay: i * 0.03 }}
                >
                  <TimelineItem record={record} onClick={setActive} onDelete={deleteRecord} />
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer */}
      {!tl.isEmpty && (
        <p className="mt-4 text-center text-caption text-ink-400">
          已记录 {recordedDays} 天 · {stage.label} {stage.emoji}
        </p>
      )}

      <RecordDetailModal
        record={active}
        onClose={() => setActive(null)}
        onDelete={(id) => { deleteRecord(id); setActive(null); }}
        onRemoveImage={removeImage}
      />
    </div>
  );
}
