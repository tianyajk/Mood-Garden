import type { AmbientKey } from '@/types/meditation';

/**
 * 冥想单一数据源：时长预设 + 音景清单。
 * 新增/调整时长或音景只改这一处（对齐 emotions.ts 的单源约定）。
 */

/** 时长预设（秒）；自定义时长仍可超出此列表 */
export interface DurationPreset {
  label: string; // 显示文案
  seconds: number;
}

export const DURATION_PRESETS: readonly DurationPreset[] = [
  { label: '3 分钟', seconds: 3 * 60 },
  { label: '5 分钟', seconds: 5 * 60 },
  { label: '10 分钟', seconds: 10 * 60 },
  { label: '15 分钟', seconds: 15 * 60 },
  { label: '20 分钟', seconds: 20 * 60 },
] as const;

/** 默认选中时长 */
export const DEFAULT_DURATION_SEC = 5 * 60;

/** 音景定义；src 为 public/ 下占位路径，文件缺失时静默降级为静音 */
export interface AmbientOption {
  key: AmbientKey;
  label: string;
  emoji: string;
  src: string | null; // null = 纯静默，不加载音频
}

export const AMBIENT_OPTIONS: readonly AmbientOption[] = [
  { key: 'silent', label: '静默', emoji: '🤍', src: null },
  { key: 'rain', label: '雨声', emoji: '🌧️', src: '/sounds/rain.mp3' },
  { key: 'ocean', label: '海浪', emoji: '🌊', src: '/sounds/ocean.mp3' },
  { key: 'forest', label: '森林', emoji: '🌲', src: '/sounds/forest.mp3' },
  { key: 'stream', label: '溪流', emoji: '💧', src: '/sounds/stream.mp3' },
] as const;

/** 默认音景 */
export const DEFAULT_AMBIENT: AmbientKey = 'silent';

/** 按 key 取音景配置（找不到回退静默） */
export function getAmbient(key: AmbientKey): AmbientOption {
  return AMBIENT_OPTIONS.find((o) => o.key === key) ?? AMBIENT_OPTIONS[0];
}
