import { Button } from '@/components/ui/Button';

interface EmptyGardenProps {
  onSeed: () => void;
}

/** 空花园：首次/当天未记录（低保真原型 三·状态C） */
export function EmptyGarden({ onSeed }: EmptyGardenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-sky-day px-6 text-center">
      <span className="text-5xl">🌱</span>
      <p className="text-body-lg text-white drop-shadow-sm">你的花园还在等待第一颗种子</p>
      <Button variant="glass" size="lg" onClick={onSeed}>
        种下第一颗
      </Button>
    </div>
  );
}
