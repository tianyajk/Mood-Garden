import { useNavigate } from 'react-router-dom';
import { EmotionPicker } from '@/components/mood/EmotionPicker';
import { MoodTextInput } from '@/components/mood/MoodTextInput';
import { MoodSubmitBar } from '@/components/mood/MoodSubmitBar';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { AiAnalysisCard } from '@/components/feedback/AiAnalysisCard';
import { useMoodForm } from '@/hooks/useMoodForm';
import { useMoodRecords } from '@/hooks/useMoodRecords';
import { useMoodSubmit } from '@/hooks/useMoodSubmit';
import { toDateKey, formatLongDate, formatTime } from '@/utils/date';
import { getEmotionConfig } from '@/config/emotions';

export function RecordPage() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const { todayRecords } = useMoodRecords();
  const { submit, submitting } = useMoodSubmit();
  const form = useMoodForm();

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

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-5 py-6">
      <header className="flex items-center justify-between">
        <Button variant="secondary" size="md" onClick={() => navigate('/')}>
          ← 返回
        </Button>
        <span className="text-caption text-ink-600">{formatLongDate(toDateKey())}</span>
      </header>

      <h1 className="font-display mt-8 text-h1 text-ink-900">此刻，你的情绪是？</h1>
      <p className="mt-1 text-caption text-ink-400">可单选，也可多选</p>

      <div className="mt-6">
        <EmotionPicker selected={form.emotions} onToggle={form.toggleEmotion} />
      </div>

      <div className="mt-6">
        <MoodTextInput
          value={form.description}
          charCount={form.charCount}
          charMax={form.charMax}
          onChange={form.updateDescription}
        />
      </div>

      <div className="sticky bottom-0 z-10 -mx-5 mt-8 bg-bg-base/85 px-5 py-4 backdrop-blur-sm sm:static sm:mx-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <MoodSubmitBar
          selectedCount={form.emotions.length}
          canSubmit={form.canSubmit}
          submitting={submitting}
          hint={form.validation.message}
          onSubmit={handleSubmit}
        />
      </div>

      {/* AI 反馈：最新一条记录的分析 */}
      {showAnalysis && (
        <div className="mt-8">
          <AiAnalysisCard analysis={showAnalysis} accentColor={accent} />
        </div>
      )}

      {/* 今日记录列表 */}
      {todayRecords.length > 0 && (
        <div className="mt-8">
          <h2 className="text-h3 text-ink-900">
            今日已记录 {todayRecords.length} 次
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {[...todayRecords].reverse().map((r) => (
              <div key={r.id} className="rounded-lg border border-line-soft bg-bg-elevated p-3">
                <div className="flex items-center justify-between">
                  <span className="text-caption text-ink-400">
                    {formatTime(r.createdAt)}
                  </span>
                  <span className="flex gap-1">
                    {r.emotions.map((e) => (
                      <span key={e}>{getEmotionConfig(e).emoji}</span>
                    ))}
                  </span>
                </div>
                {r.description && (
                  <p className="mt-1 text-body text-ink-700 line-clamp-2">{r.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
