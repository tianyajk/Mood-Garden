import * as THREE from 'three';
import type { TimeOfDay } from '@/types/garden';

export interface SceneLights {
  hemi: THREE.HemisphereLight;
  dir: THREE.DirectionalLight;
}

/** 昼夜灯光预设：[半球光强, 平行光强, 平行光色] */
const LIGHT_PRESET: Record<TimeOfDay, { hemi: number; dir: number; color: number }> = {
  day: { hemi: 1.0, dir: 1.1, color: 0xfff4e0 },
  dusk: { hemi: 0.75, dir: 0.9, color: 0xffcaa0 },
  night: { hemi: 0.4, dir: 0.35, color: 0x9fb0e0 },
  overcast: { hemi: 0.7, dir: 0.45, color: 0xcfd8e0 },
};

/** 初始化半球光 + 平行光（柔和、自然基调） */
export function setupLights(scene: THREE.Scene): SceneLights {
  const hemi = new THREE.HemisphereLight(0xffffff, 0x8bc79a, 1.0);
  hemi.position.set(0, 20, 0);
  scene.add(hemi);

  const dir = new THREE.DirectionalLight(0xffffff, 1.0);
  dir.position.set(6, 12, 8);
  scene.add(dir);

  return { hemi, dir };
}

/** 按昼夜调整灯光强度与色温 */
export function applyTimeOfDay(lights: SceneLights, timeOfDay: TimeOfDay): void {
  const preset = LIGHT_PRESET[timeOfDay];
  lights.hemi.intensity = preset.hemi;
  lights.dir.intensity = preset.dir;
  lights.dir.color.setHex(preset.color);
}
