import { Button } from '@/components/ui/Button';

interface MoodSubmitBarProps {
  selectedCount: number;
  canSubmit: boolean;
  submitting: boolean;
  hint: string | null;
  onSubmit: () => void;
}

/** 提交 + 校验提示：未选禁用，提交中 loading（低保真状态 A/B） */
export function MoodSubmitBar({
  selectedCount,
  canSubmit,
  submitting,
  hint,
  onSubmit,
}: MoodSubmitBarProps) {
  const label = submitting
    ? '◐ 正在保存…'
    : selectedCount > 0
      ? `记录此刻 (${selectedCount})`
      : '记录此刻';

  return (
    <div className="flex flex-col items-center gap-2">
      {!canSubmit && hint && <p className="text-caption text-ink-400">{hint}</p>}
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
