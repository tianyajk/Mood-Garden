import type { AmbientKey } from '@/types/meditation';
import { cn } from '@/utils/cn';
import { AMBIENT_OPTIONS } from '@/config/meditation';

interface SoundPickerProps {
  value: AmbientKey;
  playing: boolean;
  volume: number;
  onSelect: (key: AmbientKey) => void;
  onVolumeChange: (v: number) => void;
}

/** 音景选择 + 音量条；占位音频缺失时点选不报错（hook 内静默降级） */
export function SoundPicker({ value, playing, volume, onSelect, onVolumeChange }: SoundPickerProps) {
  const showVolume = value !== 'silent';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {AMBIENT_OPTIONS.map((option) => {
          const active = option.key === value;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onSelect(option.key)}
              aria-pressed={active}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-2 text-caption transition-all duration-300',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
                active ? 'bg-white text-ink-900 shadow-md' : 'glass text-white hover:shadow-glow',
              )}
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      {showVolume && (
        <label className="flex items-center gap-2 text-caption text-white/80">
          <span aria-hidden>{playing ? '🔊' : '🔈'}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            aria-label="背景音量"
            className="h-1 w-40 cursor-pointer accent-white"
          />
        </label>
      )}
    </div>
  );
}
