import type { EmotionKey } from '@/types/mood';
import { EMOTION_LIST } from '@/config/emotions';
import { EmotionCard } from './EmotionCard';

interface EmotionPickerProps {
  selected: EmotionKey[];
  onToggle: (key: EmotionKey) => void;
}

/** 情绪选择网格（单/多选）：桌面 4 列、移动 2 列 */
export function EmotionPicker({ selected, onToggle }: EmotionPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {EMOTION_LIST.map((config) => (
        <EmotionCard
          key={config.key}
          config={config}
          selected={selected.includes(config.key)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
