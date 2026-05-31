import type { MoodRecord } from '@/types/mood';
import { Modal } from '@/components/ui/Modal';
import { AiAnalysisCard } from '@/components/feedback/AiAnalysisCard';
import { getEmotionConfig } from '@/config/emotions';
import { formatLongDate } from '@/utils/date';

interface RecordDetailModalProps {
  record: MoodRecord | null;
  onClose: () => void;
  onViewInGarden?: (record: MoodRecord) => void;
}

export function RecordDetailModal({ record, onClose }: RecordDetailModalProps) {
  const configs = record?.emotions.map(getEmotionConfig) ?? [];
  const accent = configs[0]?.color;

  return (
    <Modal open={record !== null} onClose={onClose} label="情绪记录详情">
      {record && (
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between">
            <h2 className="font-display text-h2 text-ink-900">{formatLongDate(record.date)}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭"
              className="text-ink-400 hover:text-ink-900 transition-colors text-lg"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {configs.map((c) => (
              <span
                key={c.key}
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-caption"
                style={{ backgroundColor: c.bgColor, color: c.color }}
              >
                <span>{c.emoji}</span> {c.label}
              </span>
            ))}
          </div>

          {record.description && (
            <p className="whitespace-pre-wrap text-body text-ink-900 leading-relaxed">{record.description}</p>
          )}

          {record.aiAnalysis && (
            <AiAnalysisCard analysis={record.aiAnalysis} accentColor={accent} />
          )}
        </div>
      )}
    </Modal>
  );
}
