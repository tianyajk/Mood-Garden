import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmotionPicker } from '@/components/mood/EmotionPicker';
import { MoodTextInput } from '@/components/mood/MoodTextInput';
import { MoodSubmitBar } from '@/components/mood/MoodSubmitBar';
import { SeedPlantingOverlay } from '@/components/mood/SeedPlantingOverlay';
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
  const [planting, setPlanting] = useState(false);

  const form = useMoodForm(
    todayRecord ? { emotions: todayRecord.emotions, description: todayRecord.description } : undefined,
  );

  // 状态 C：今日已记录且未进入编辑
  if (todayRecord && !editing) {
    return <RecordedToday record={todayRecord} onEdit={() => setEditing(true)} />;
  }

  const handleSubmit = async () => {
    if (!form.canSubmit) return;
    setPlanting(true); // 链式动效：种子落地
    const { degraded } = await submit(form.draft);
    notify('今天的情绪已种下');
    if (degraded) notify('AI 暂时打了个盹，先用了默认陪伴语', 'warning');
    await new Promise((r) => setTimeout(r, 700)); // 让种子落定再进花园看生长
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

      {/* 移动端底部吸附，桌面端常规流式 */}
      <div className="sticky bottom-0 z-10 -mx-5 mt-8 bg-bg-base/85 px-5 py-4 backdrop-blur-sm sm:static sm:mx-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <MoodSubmitBar
          selectedCount={form.emotions.length}
          canSubmit={form.canSubmit}
          submitting={submitting || planting}
          hint={form.validation.message}
          onSubmit={handleSubmit}
        />
      </div>

      <SeedPlantingOverlay active={planting} />
    </div>
  );
}
