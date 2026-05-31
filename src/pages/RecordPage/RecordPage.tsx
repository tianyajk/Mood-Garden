import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { EmotionPicker } from '@/components/mood/EmotionPicker';
import { MoodTextInput } from '@/components/mood/MoodTextInput';
import { MoodSubmitBar } from '@/components/mood/MoodSubmitBar';
import { AiAnalysisCard } from '@/components/feedback/AiAnalysisCard';
import { useMoodForm } from '@/hooks/useMoodForm';
import { useMoodRecords } from '@/hooks/useMoodRecords';
import { useMoodSubmit } from '@/hooks/useMoodSubmit';
import { useToast } from '@/components/ui/Toast';
import { toDateKey, formatLongDate, formatTime } from '@/utils/date';
import { getEmotionConfig } from '@/config/emotions';
import { duration, easing } from '@/config/theme';

export function RecordPage() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const { todayRecords } = useMoodRecords();
  const { submit, submitting } = useMoodSubmit();
  const form = useMoodForm();
  const reduce = useReducedMotion();

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
    <div className="mx-auto min-h-screen max-w-[480px] px-5 py-8">
      {/* Header */}
      <motion.header
        className="flex items-center justify-between"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <button
          onClick={() => navigate('/')}
          className="text-ink-400 hover:text-ink-900 transition-colors text-body"
          aria-label="返回首页"
        >
          ←
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
        <p className="mt-1 text-caption text-ink-400">可以多选</p>
      </motion.div>

      {/* Emotion Grid */}
      <motion.div
        className="mt-8"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: duration.slow, ease: easing.gentle, delay: 0.2 }}
      >
        <EmotionPicker selected={form.emotions} onToggle={form.toggleEmotion} />
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
              <div
                key={r.id}
                className="paper-card rounded-xl px-4 py-3 flex items-center gap-3"
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
                <span className="text-micro text-ink-400 shrink-0">{formatTime(r.createdAt)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Bottom spacer */}
      <div className="h-12" />
    </div>
  );
}
