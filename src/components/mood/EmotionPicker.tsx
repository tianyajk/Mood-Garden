import type { EmotionKey } from '@/types/mood';
import { EMOTION_LIST } from '@/config/emotions';
import { EmotionCard } from './EmotionCard';

interface EmotionPickerProps {
  selected: EmotionKey[];
  onToggle: (key: EmotionKey) => void;
}

export function EmotionPicker({ selected, onToggle }: EmotionPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
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
