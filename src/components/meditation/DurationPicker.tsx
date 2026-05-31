import { cn } from '@/utils/cn';
import { DURATION_PRESETS } from '@/config/meditation';

interface DurationPickerProps {
  value: number; // 当前选中秒数
  onChange: (seconds: number) => void;
  disabled?: boolean;
}

/** 时长预设选择（玻璃胶囊横排）；运行中禁用 */
export function DurationPicker({ value, onChange, disabled }: DurationPickerProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {DURATION_PRESETS.map((preset) => {
        const active = preset.seconds === value;
        return (
          <button
            key={preset.seconds}
            type="button"
            disabled={disabled}
            onClick={() => onChange(preset.seconds)}
            aria-pressed={active}
            className={cn(
              'rounded-full px-4 py-2 text-caption font-medium transition-all duration-300',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
              'disabled:cursor-not-allowed disabled:opacity-40',
              active ? 'bg-white text-ink-900 shadow-md' : 'glass text-white hover:shadow-glow',
            )}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}
