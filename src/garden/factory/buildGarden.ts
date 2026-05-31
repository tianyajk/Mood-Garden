import * as THREE from 'three';
import type { GardenViewModel } from '@/types/garden';
import { buildPlant } from '@/garden/elements/plantCatalog';

/** 每个植物 Group 的自定义数据（raycast 回溯 + 摇曳相位 + 绽放延迟） */
export interface PlantUserData {
  recordId: string;
  date: string;
  phase: number;
  bloomDelay: number; // 错峰绽放延迟（秒）
}

/** 性能上限：最多渲染的株数（按最近记录优先，超出不渲染） */
const MAX_PLANTS = 80;

/** 黄金角螺旋布点，使植物分布自然且位置稳定（同输入同布局） */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/**
 * 视图模型 → 植物 Group（不含地形/灯光，由 SceneManager 组合）。
 * 每条记录一株，userData.recordId 供点击回溯。
 */
export function buildGarden(vm: GardenViewModel): THREE.Group {
  const group = new THREE.Group();
  const plants = vm.plants.slice(-MAX_PLANTS);

  plants.forEach((model, i) => {
    const plantId = model.plantTypes[0] ?? 'sunflower';
    const plant = buildPlant(plantId, model.color);

    const radius = 0.85 * Math.sqrt(i + 1);
    const angle = i * GOLDEN_ANGLE;
    plant.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    plant.rotation.y = angle;

    const userData: PlantUserData = {
      recordId: model.recordId,
      date: model.date,
      phase: i * 0.7,
      bloomDelay: i * 0.06,
    };
    plant.userData = userData;
    group.add(plant);
  });

  return group;
}
