import { Button } from '@/components/ui/Button';

interface MoodSubmitBarProps {
  selectedCount: number;
  canSubmit: boolean;
  submitting: boolean;
  hint: string | null;
  onSubmit: () => void;
}

export function MoodSubmitBar({
  selectedCount,
  canSubmit,
  submitting,
  hint,
  onSubmit,
}: MoodSubmitBarProps) {
  const label = submitting
    ? '记录中…'
    : selectedCount > 0
      ? `记录 · ${selectedCount}`
      : '选择情绪';

  return (
    <div className="flex flex-col items-center gap-2">
      {!canSubmit && hint && (
        <p className="text-caption text-ink-400">{hint}</p>
      )}
      <Button
        size="lg"
        onClick={onSubmit}
        disabled={!canSubmit || submitting}
        className="w-full max-w-xs"
      >
        {label}
      </Button>
    </div>
  );
}
