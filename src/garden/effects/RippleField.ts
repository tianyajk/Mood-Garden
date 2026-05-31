import * as THREE from 'three';
import type { ManagedEffect } from './ParticleField';

const RING_COUNT = 6;
const CYCLE = 2.4; // 单个涟漪扩散周期（秒）

interface Ripple {
  mesh: THREE.Mesh;
  offset: number;
}

/** 雨天地面涟漪：扩散的环 + 渐隐，循环复位（配合 rain 粒子使用） */
export class RippleField implements ManagedEffect {
  readonly object: THREE.Group;
  private ripples: Ripple[] = [];
  private elapsed = 0;

  constructor() {
    this.object = new THREE.Group();
    for (let i = 0; i < RING_COUNT; i += 1) {
      const geo = new THREE.RingGeometry(0.12, 0.18, 24);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xbfe0ec,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set((Math.random() - 0.5) * 6, 0.02, (Math.random() - 0.5) * 6);
      this.object.add(mesh);
      this.ripples.push({ mesh, offset: Math.random() * CYCLE });
    }
  }

  update(dt: number): void {
    this.elapsed += dt;
    for (const r of this.ripples) {
      const phase = ((this.elapsed + r.offset) % CYCLE) / CYCLE;
      const scale = 0.3 + phase * 3.2;
      r.mesh.scale.set(scale, scale, scale);
      (r.mesh.material as THREE.MeshBasicMaterial).opacity = (1 - phase) * 0.45;
      if (phase < dt / CYCLE) {
        r.mesh.position.set((Math.random() - 0.5) * 6, 0.02, (Math.random() - 0.5) * 6);
      }
    }
  }

  dispose(): void {
    for (const r of this.ripples) {
      r.mesh.geometry.dispose();
      (r.mesh.material as THREE.Material).dispose();
    }
  }
}
