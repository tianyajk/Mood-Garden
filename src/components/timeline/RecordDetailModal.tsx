import type { MoodRecord } from '@/types/mood';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AiAnalysisCard } from '@/components/feedback/AiAnalysisCard';
import { getEmotionConfig } from '@/config/emotions';
import { formatLongDate } from '@/utils/date';

interface RecordDetailModalProps {
  record: MoodRecord | null;
  onClose: () => void;
  onViewInGarden: (record: MoodRecord) => void;
}

/** 记录详情弹窗（低保真原型 四·详情）：日期 / 情绪 / 记录 / AI 分析 */
export function RecordDetailModal({ record, onClose, onViewInGarden }: RecordDetailModalProps) {
  const configs = record?.emotions.map(getEmotionConfig) ?? [];
  const accent = configs[0]?.color;

  return (
    <Modal open={record !== null} onClose={onClose} label="情绪记录详情">
      {record && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <h2 className="text-h3 text-ink-900">{formatLongDate(record.date)}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭"
              className="text-ink-400 hover:text-ink-900"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {configs.map((c) => (
              <span
                key={c.key}
                className="flex items-center gap-1 rounded-full px-3 py-1 text-caption"
                style={{ backgroundColor: c.bgColor, color: c.color }}
              >
                {c.emoji} {c.label}
              </span>
            ))}
          </div>

          {record.description && (
            <p className="whitespace-pre-wrap text-body text-ink-900">{record.description}</p>
          )}

          {record.aiAnalysis && (
            <AiAnalysisCard analysis={record.aiAnalysis} accentColor={accent} />
          )}

          <Button variant="secondary" onClick={() => onViewInGarden(record)} className="self-stretch">
            在花园中查看
          </Button>
        </div>
      )}
    </Modal>
  );
}
