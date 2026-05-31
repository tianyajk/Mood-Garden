import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmotionPicker } from '@/components/mood/EmotionPicker';
import { MoodTextInput } from '@/components/mood/MoodTextInput';
import { MoodSubmitBar } from '@/components/mood/MoodSubmitBar';
import { RecordedToday } from '@/pages/RecordPage/RecordedToday';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useMoodForm } from '@/hooks/useMoodForm';
import { useMoodRecords } from '@/hooks/useMoodRecords';
import { useMoodSubmit } from '@/hooks/useMoodSubmit';
import { toDateKey, formatLongDate } from '@/utils/date';

/** 情绪记录页：选情绪 + 描述 + 提交（页面只组合，逻辑在 hooks） */
export function RecordPage() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const { todayRecord } = useMoodRecords();
  const { submit, submitting } = useMoodSubmit();
  const [editing, setEditing] = useState(false);

  const form = useMoodForm(
    todayRecord ? { emotions: todayRecord.emotions, description: todayRecord.description } : undefined,
  );

  // 状态 C：今日已记录且未进入编辑
  if (todayRecord && !editing) {
    return <RecordedToday record={todayRecord} onEdit={() => setEditing(true)} />;
  }

  const handleSubmit = async () => {
    if (!form.canSubmit) return;
    const { degraded } = await submit(form.draft);
    notify('今天的情绪已种下');
    if (degraded) notify('AI 暂时打了个盹，先用了默认陪伴语', 'warning');
    navigate('/garden');
  };

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-5 py-6">
      <header className="flex items-center justify-between">
        <Button variant="secondary" size="md" onClick={() => navigate(-1)}>
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

      <div className="mt-8">
        <MoodSubmitBar
          selectedCount={form.emotions.length}
          canSubmit={form.canSubmit}
          submitting={submitting}
          hint={form.validation.message}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
