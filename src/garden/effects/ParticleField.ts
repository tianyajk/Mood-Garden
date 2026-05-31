import * as THREE from 'three';
import { softCircleTexture } from '@/garden/core/sprite';

/** 粒子运动模式 */
export type ParticleMode = 'rise' | 'fall' | 'float';

export interface ParticlePreset {
  count: number;
  color: THREE.ColorRepresentation;
  size: number;
  opacity: number;
  mode: ParticleMode;
  speed: number; // 纵向基础速度（单位/秒）
  sway: number; // 横向漂移幅度
  additive?: boolean; // 发光叠加（光点/萤火虫/火焰）
}

/** 受引擎统一调度的特效对象 */
export interface ManagedEffect {
  object: THREE.Object3D;
  update(dt: number): void;
  dispose(): void;
}

const AREA = { x: 9, y: 6, z: 9 }; // 粒子活动包围盒

/**
 * 通用粒子场（基础特效）：上升/下落/漂浮三种模式，边界外循环复位。
 * 金色光点、雨、雪、萤火虫、雾等均由 preset 参数化复用。
 */
export class ParticleField implements ManagedEffect {
  readonly object: THREE.Points;
  private velocities: Float32Array;
  private preset: ParticlePreset;
  private elapsed = 0;

  constructor(preset: ParticlePreset) {
    this.preset = preset;
    const positions = new Float32Array(preset.count * 3);
    this.velocities = new Float32Array(preset.count);
    for (let i = 0; i < preset.count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * AREA.x;
      positions[i * 3 + 1] = Math.random() * AREA.y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * AREA.z;
      this.velocities[i] = preset.speed * (0.6 + Math.random() * 0.8);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: preset.color,
      size: preset.size,
      map: softCircleTexture(),
      transparent: true,
      opacity: preset.opacity,
      depthWrite: false,
      sizeAttenuation: true,
      alphaTest: 0.01,
      blending: preset.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.object = new THREE.Points(geometry, material);
  }

  update(dt: number): void {
    this.elapsed += dt;
    const attr = this.object.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < this.preset.count; i += 1) {
      const yi = i * 3 + 1;
      const xi = i * 3;
      if (this.preset.mode === 'fall') {
        arr[yi] -= this.velocities[i] * dt;
        if (arr[yi] < 0) arr[yi] = AREA.y;
      } else if (this.preset.mode === 'rise') {
        arr[yi] += this.velocities[i] * dt;
        if (arr[yi] > AREA.y) arr[yi] = 0;
      } else {
        arr[yi] += Math.sin(this.elapsed + i) * this.preset.speed * dt;
      }
      if (this.preset.sway > 0) {
        arr[xi] += Math.sin(this.elapsed * 0.8 + i) * this.preset.sway * dt;
      }
    }
    attr.needsUpdate = true;
  }

  dispose(): void {
    this.object.geometry.dispose();
    (this.object.material as THREE.Material).dispose();
  }
}
