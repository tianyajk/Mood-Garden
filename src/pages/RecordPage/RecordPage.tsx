import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { EmotionPicker } from '@/components/mood/EmotionPicker';
import { MoodTextInput } from '@/components/mood/MoodTextInput';
import { MoodSubmitBar } from '@/components/mood/MoodSubmitBar';
import { ImageUploader } from '@/components/mood/ImageUploader';
import { AiAnalysisCard } from '@/components/feedback/AiAnalysisCard';
import { PhotoDetailModal } from '@/components/album/PhotoDetailModal';
import { useMoodForm } from '@/hooks/useMoodForm';
import { useMoodRecords } from '@/hooks/useMoodRecords';
import { useMoodSubmit } from '@/hooks/useMoodSubmit';
import { useMeditationRecords } from '@/hooks/useMeditationRecords';
import { useToast } from '@/components/ui/Toast';
import { toDateKey, formatLongDate, formatTime } from '@/utils/date';
import { getEmotionConfig } from '@/config/emotions';
import { duration, easing } from '@/config/theme';
import type { MoodRecord } from '@/types/mood';

export function RecordPage() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const { todayRecords } = useMoodRecords();
  const { submit, submitting } = useMoodSubmit();
  const { sessions: meditationSessions } = useMeditationRecords();
  const form = useMoodForm();
  const reduce = useReducedMotion();
  const [selectedRecord, setSelectedRecord] = useState<MoodRecord | null>(null);

  const getMeditationMinutes = (date: string) =>
    meditationSessions
      .filter((s) => s.date === date)
      .reduce((sum, s) => sum + Math.floor(s.elapsedSec / 60), 0);

  const handleSubmit = async () => {
    if (!form.canSubmit) return;
    const { degraded } = await submit(form.draft);
    form.reset();
    notify('情绪已记录');
    if (degraded) notify('AI 暂时打了个盹，先用了默认反馈', 'warning');
  };

  const latest = todayRecords[todayRecords.length - 1];
  const showAnalysis = latest?.aiAnalysis ?? null;
  const accent = latest?.emotions[0] ? getEmotionConfig(latest.emotions[0]).color : undefined;

  const fadeIn = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: easing.gentle } },
  };

  return (
    <div className="mx-auto min-h-screen max-w-[480px] px-5 py-8 bg-bg-base">
      {/* Header */}
      <motion.header
        className="flex items-center justify-between"
        variants={fadeIn}
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
        <span className="text-caption text-ink-400">{formatLongDate(toDateKey())}</span>
      </motion.header>

      {/* Title */}
      <motion.div
        className="mt-10"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: duration.slow, ease: easing.gentle, delay: 0.1 }}
      >
        <h1 className="font-display text-h1 text-ink-900">此刻，你的情绪是？</h1>
        <p className="mt-1 text-caption text-ink-400">选择此刻的感受</p>
      </motion.div>

      {/* Emotion Grid */}
      <motion.div
        className="mt-8"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: duration.slow, ease: easing.gentle, delay: 0.2 }}
      >
        <EmotionPicker selected={form.emotions} onSelect={form.selectEmotion} />
      </motion.div>

      {/* Text Input */}
      <motion.div
        className="mt-6"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: duration.slow, ease: easing.gentle, delay: 0.3 }}
      >
        <MoodTextInput
          value={form.description}
          charCount={form.charCount}
          charMax={form.charMax}
          onChange={form.updateDescription}
        />
      </motion.div>

      {/* Image Upload */}
      <motion.div
        className="mt-4"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: duration.slow, ease: easing.gentle, delay: 0.33 }}
      >
        <ImageUploader image={form.image} onChange={form.setImage} />
      </motion.div>

      {/* Submit */}
      <motion.div
        className="mt-8"
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1 }}
        transition={{ duration: duration.slow, ease: easing.gentle, delay: 0.35 }}
      >
        <MoodSubmitBar
          selectedCount={form.emotions.length}
          canSubmit={form.canSubmit}
          submitting={submitting}
          hint={form.validation.message}
          onSubmit={handleSubmit}
        />
      </motion.div>

      {/* AI Feedback */}
      {showAnalysis && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.slow, ease: easing.gentle }}
        >
          <AiAnalysisCard analysis={showAnalysis} accentColor={accent} />
        </motion.div>
      )}

      {/* Today's Records */}
      {todayRecords.length > 0 && (
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.slow, delay: 0.2 }}
        >
          <h2 className="font-display text-h3 text-ink-900">
            今天 · {todayRecords.length} 条记录
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {[...todayRecords].reverse().map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRecord(r)}
                className="paper-card rounded-xl px-4 py-3 flex items-center gap-3 hover:shadow-md transition-shadow text-left w-full"
              >
                <span className="text-lg shrink-0">
                  {r.emotions.map((e) => getEmotionConfig(e).emoji).join('')}
                </span>
                <div className="flex-1 min-w-0">
                  {r.description ? (
                    <p className="text-caption text-ink-700 line-clamp-1">{r.description}</p>
                  ) : (
                    <p className="text-caption text-ink-400 italic">仅记录了情绪</p>
                  )}
                </div>
                {r.image && <span className="text-sm shrink-0">📷</span>}
                <span className="text-micro text-ink-400 shrink-0">{formatTime(r.createdAt)}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <PhotoDetailModal
        record={selectedRecord}
        meditationMinutes={selectedRecord ? getMeditationMinutes(selectedRecord.date) : 0}
        onClose={() => setSelectedRecord(null)}
      />

      {/* Bottom spacer */}
      <div className="h-12" />
    </div>
  );
}
