import * as THREE from 'three';
import type { TimeOfDay } from '@/types/garden';

/** 晨昏天空渐变预设（对齐 视觉设计.md 昼夜系统） */
const SKY_PRESET: Record<TimeOfDay, [string, string]> = {
  day: ['#BFE3D0', '#E9F2EC'],
  dusk: ['#F6C453', '#A99BD4'],
  night: ['#2E3550', '#4A4E73'],
  overcast: ['#9FB0C4', '#CDD5DE'],
};

/** 取地平线（天空底部）颜色，供雾色融合地面边缘 */
export function getHorizonColor(timeOfDay: TimeOfDay): number {
  return new THREE.Color(SKY_PRESET[timeOfDay][1]).getHex();
}

/** 用 canvas 生成竖向渐变天空贴图（顶深底浅） */
export function createSkyTexture(timeOfDay: TimeOfDay): THREE.Texture {
  const [top, bottom] = SKY_PRESET[timeOfDay];
  const canvas = document.createElement('canvas');
  canvas.width = 2;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, top);
    grad.addColorStop(1, bottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
