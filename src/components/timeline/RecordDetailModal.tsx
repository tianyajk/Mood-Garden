import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MoodRecord } from '@/types/mood';
import { Modal } from '@/components/ui/Modal';
import { AiAnalysisCard } from '@/components/feedback/AiAnalysisCard';
import { getEmotionConfig } from '@/config/emotions';
import { formatLongDate } from '@/utils/date';

interface RecordDetailModalProps {
  record: MoodRecord | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onRemoveImage?: (id: string) => void;
}

export function RecordDetailModal({ record, onClose, onDelete, onRemoveImage }: RecordDetailModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const configs = record?.emotions.map(getEmotionConfig) ?? [];
  const accent = configs[0]?.color;

  function handleClose() {
    setConfirmDelete(false);
    onClose();
  }

  function handleDelete() {
    if (!record) return;
    onDelete?.(record.id);
    handleClose();
  }

  return (
    <Modal open={record !== null} onClose={handleClose} label="情绪记录详情">
      {record && (
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between">
            <h2 className="font-display text-h2 text-ink-900">{formatLongDate(record.date)}</h2>
            <button
              type="button"
              onClick={handleClose}
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

          {record.image && (
            <div className="relative group rounded-2xl overflow-hidden">
              <img
                src={record.image}
                alt="情绪配图"
                className="w-full object-cover max-h-64 rounded-2xl"
              />
              {onRemoveImage && (
                <button
                  type="button"
                  onClick={() => { onRemoveImage(record.id); }}
                  className="absolute top-2 right-2 rounded-xl bg-black/50 px-3 py-1.5 text-micro text-white/90 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  aria-label="删除图片"
                >
                  删除图片
                </button>
              )}
            </div>
          )}

          {record.aiAnalysis && (
            <AiAnalysisCard analysis={record.aiAnalysis} accentColor={accent} />
          )}

          {onDelete && (
            <div className="border-t border-line-soft pt-4">
              <AnimatePresence mode="wait">
                {!confirmDelete ? (
                  <motion.button
                    key="trigger"
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="w-full rounded-xl py-2 text-caption text-ink-400 hover:text-red-500 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    删除这条记录
                  </motion.button>
                ) : (
                  <motion.div
                    key="confirm"
                    className="flex items-center justify-center gap-3"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="text-caption text-ink-600">确认删除这条记录？</span>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="rounded-xl bg-red-50 px-4 py-1.5 text-caption text-red-500 hover:bg-red-100 transition-colors"
                    >
                      确认删除
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="rounded-xl bg-bg-sunken px-4 py-1.5 text-caption text-ink-600 hover:bg-line-soft transition-colors"
                    >
                      取消
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
