import { Button } from '@/components/ui/Button';

interface TimelineEmptyProps {
  variant: 'empty' | 'no-result';
  onAction?: () => void;
}

/** 时间轴空态 / 搜索无结果（低保真原型 四·状态） */
export function TimelineEmpty({ variant, onAction }: TimelineEmptyProps) {
  if (variant === 'no-result') {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-body text-ink-600">没有找到相关的情绪记录</p>
        <p className="text-caption text-ink-400">试试别的关键词？</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <span className="text-4xl">🌱</span>
      <p className="text-body text-ink-600">旅程还没开始，先记录一次心情吧</p>
      <Button onClick={onAction}>去记录</Button>
    </div>
  );
}
