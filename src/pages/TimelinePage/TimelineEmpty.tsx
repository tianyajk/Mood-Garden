import { Button } from '@/components/ui/Button';

interface TimelineEmptyProps {
  variant: 'empty' | 'no-result';
  onAction?: () => void;
}

export function TimelineEmpty({ variant, onAction }: TimelineEmptyProps) {
  if (variant === 'no-result') {
    return (
      <div className="flex flex-col items-center gap-2 py-20 text-center">
        <p className="font-display text-h3 text-ink-600">没有找到</p>
        <p className="text-body text-ink-400">试试其他关键词</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <span className="text-5xl">📝</span>
      <p className="font-display text-h3 text-ink-700">还没有记录</p>
      <p className="text-body text-ink-400">记录下此刻的心情，开始你的情绪旅程</p>
      {onAction && (
        <Button onClick={onAction} className="mt-2">记录第一条</Button>
      )}
    </div>
  );
}
