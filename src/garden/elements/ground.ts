import * as THREE from 'three';
import type { TimeOfDay } from '@/types/garden';

/** 昼夜对应的地面基色（柔化、与天空更协调） */
const GROUND_COLOR: Record<TimeOfDay, number> = {
  day: 0xbcd9c4,
  dusk: 0xb0c8b2,
  night: 0x49566c,
  overcast: 0xacbcae,
};

/** 圆形草地地形（接住植物；半径大 + 雾，边缘融进天空） */
export function createGround(timeOfDay: TimeOfDay): THREE.Mesh {
  const geo = new THREE.CircleGeometry(18, 64);
  const mat = new THREE.MeshStandardMaterial({
    color: GROUND_COLOR[timeOfDay],
    roughness: 0.95,
  });
  const ground = new THREE.Mesh(geo, mat);
  ground.rotation.x = -Math.PI / 2;
  return ground;
}
