import * as THREE from 'three';
import { createFlower, createGrass, createThorn, createTree } from './plantBuilders';

/** 植物元素 id → 原型（对齐 config/emotions.ts 的 plants 字段） */
type Archetype = 'flower' | 'thorn' | 'tree' | 'grass';

const PLANT_ARCHETYPE: Record<string, Archetype> = {
  sunflower: 'flower',
  'white-flower': 'flower',
  grass: 'grass',
  'firework-flower': 'flower',
  'blue-thorn': 'thorn',
  'purple-flower-sea': 'flower',
  'moonlight-flower': 'flower',
  'red-spider-lily': 'flower',
  'snow-tree': 'tree',
};

const BUILDERS: Record<Archetype, (color: THREE.ColorRepresentation) => THREE.Group> = {
  flower: createFlower,
  thorn: createThorn,
  tree: createTree,
  grass: createGrass,
};

/** 按植物 id 构建一株（未知 id 兜底为花） */
export function buildPlant(plantId: string, color: THREE.ColorRepresentation): THREE.Group {
  const archetype = PLANT_ARCHETYPE[plantId] ?? 'flower';
  return BUILDERS[archetype](color);
}
