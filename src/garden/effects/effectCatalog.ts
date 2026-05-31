import { ParticleField, type ManagedEffect, type ParticlePreset } from './ParticleField';
import { RippleField } from './RippleField';

/**
 * 特效 id → 粒子预设（对齐 config/emotions.ts 的 effects 字段）。
 * Phase2 基础特效层；更精细的涟漪/雾气分层留待 Phase3。
 */
const EFFECT_PRESET: Record<string, ParticlePreset> = {
  'gold-spark': { count: 36, color: 0xf7d27a, size: 0.16, opacity: 0.85, mode: 'rise', speed: 0.4, sway: 0.25, additive: true },
  butterfly: { count: 8, color: 0xf58fb4, size: 0.24, opacity: 0.85, mode: 'float', speed: 0.35, sway: 0.5 },
  breeze: { count: 28, color: 0xd6efdd, size: 0.12, opacity: 0.5, mode: 'float', speed: 0.25, sway: 0.4, additive: true },
  sparkle: { count: 32, color: 0xffe6f0, size: 0.15, opacity: 0.8, mode: 'float', speed: 0.35, sway: 0.3, additive: true },
  rainbow: { count: 28, color: 0xffc0d8, size: 0.16, opacity: 0.7, mode: 'rise', speed: 0.4, sway: 0.3, additive: true },
  rain: { count: 180, color: 0xb2cdea, size: 0.09, opacity: 0.5, mode: 'fall', speed: 4.5, sway: 0 },
  fog: { count: 30, color: 0xd6dde4, size: 1.0, opacity: 0.12, mode: 'float', speed: 0.12, sway: 0.2 },
  'floating-cloud': { count: 16, color: 0xccbce4, size: 1.1, opacity: 0.16, mode: 'float', speed: 0.1, sway: 0.25 },
  firefly: { count: 28, color: 0xfff0a0, size: 0.18, opacity: 0.95, mode: 'float', speed: 0.3, sway: 0.5, additive: true },
  flame: { count: 48, color: 0xed7a4a, size: 0.18, opacity: 0.8, mode: 'rise', speed: 1.5, sway: 0.25, additive: true },
  snow: { count: 110, color: 0xffffff, size: 0.16, opacity: 0.85, mode: 'fall', speed: 0.8, sway: 0.35 },
  'cold-glow': { count: 36, color: 0xcdeaf2, size: 0.14, opacity: 0.55, mode: 'float', speed: 0.2, sway: 0.25, additive: true },
};

/**
 * 由特效 id 列表构建粒子场（去重 + 跳过未知 id）。
 * quality<1 时按比例下调粒子数（移动端降级）；雨天附加地面涟漪。
 */
export function createEffects(effectIds: string[], quality = 1): ManagedEffect[] {
  const unique = Array.from(new Set(effectIds));
  const effects: ManagedEffect[] = [];
  for (const id of unique) {
    const preset = EFFECT_PRESET[id];
    if (!preset) continue;
    const scaled: ParticlePreset = { ...preset, count: Math.max(1, Math.round(preset.count * quality)) };
    effects.push(new ParticleField(scaled));
  }
  if (unique.includes('rain')) {
    effects.push(new RippleField());
  }
  return effects;
}
