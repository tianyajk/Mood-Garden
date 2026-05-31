import * as THREE from 'three';
import type { GardenViewModel } from '@/types/garden';
import { createSkyTexture, getHorizonColor } from './sky';
import { applyTimeOfDay, setupLights, type SceneLights } from './lights';
import { createGround } from '@/garden/elements/ground';
import { buildGarden, type PlantUserData } from '@/garden/factory/buildGarden';
import { createEffects } from '@/garden/effects/effectCatalog';
import type { ManagedEffect } from '@/garden/effects/ParticleField';

export type PlantSelectHandler = (recordId: string) => void;

/** 引擎运行参数（响应式 / 无障碍降级） */
export interface SceneOptions {
  reducedMotion: boolean; // true：关闭摇曳/绽放/视差，仅静态
  quality: number; // 粒子数倍率（移动端 < 1）
}

const BLOOM_DURATION = 0.6;

/** 释放单个节点的几何与材质 */
function disposeNode(node: THREE.Object3D): void {
  const mesh = node as THREE.Mesh;
  if (mesh.geometry) mesh.geometry.dispose();
  const mat = mesh.material;
  if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
  else if (mat) (mat as THREE.Material).dispose();
}

/** easeOutCubic */
function easeOut(p: number): number {
  return 1 - Math.pow(1 - p, 3);
}

/**
 * Three.js 场景生命周期管理（与 React 解耦，纯 TS）。
 * renderer/scene/camera、渲染循环、resize、raycast 拾取、错峰绽放、聚焦、dispose。
 */
export class SceneManager {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly lights: SceneLights;
  private readonly clock = new THREE.Clock();
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();

  private container: HTMLElement;
  private options: SceneOptions;
  private gardenGroup: THREE.Group | null = null;
  private groundMesh: THREE.Mesh | null = null;
  private effects: ManagedEffect[] = [];
  private skyTexture: THREE.Texture | null = null;
  private onSelect: PlantSelectHandler | null = null;
  private focusedId: string | null = null;
  private plantsBornAt = 0;
  private rafId = 0;

  constructor(container: HTMLElement, options: SceneOptions = { reducedMotion: false, quality: 1 }) {
    this.container = container;
    this.options = options;
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;

    this.renderer = new THREE.WebGLRenderer({ antialias: options.quality >= 1, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, options.quality >= 1 ? 2 : 1.5));
    this.renderer.setSize(width, height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    this.camera.position.set(0, 3.4, 8.4);
    this.camera.lookAt(0, 0.8, 0);

    this.lights = setupLights(this.scene);

    this.renderer.domElement.addEventListener('pointerdown', this.handlePointer);
    window.addEventListener('resize', this.handleResize);
    this.loop();
  }

  /** 设置点击植物的回调 */
  setOnSelect(handler: PlantSelectHandler | null): void {
    this.onSelect = handler;
  }

  /** 接收 React 派生的视图模型，重建场景 */
  setViewModel(vm: GardenViewModel): void {
    this.applySky(vm);
    this.rebuildGround(vm);
    this.rebuildPlants(vm);
    this.rebuildEffects(vm);
  }

  /** 高亮定位某株（时间轴「在花园中查看」） */
  focus(recordId: string | null): void {
    this.focusedId = recordId;
  }

  private applySky(vm: GardenViewModel): void {
    this.skyTexture?.dispose();
    this.skyTexture = createSkyTexture(vm.timeOfDay);
    this.scene.background = this.skyTexture;
    applyTimeOfDay(this.lights, vm.timeOfDay);

    // 雾：让地面边缘自然融进天空，消除硬穹顶
    const horizon = getHorizonColor(vm.timeOfDay);
    if (this.scene.fog instanceof THREE.Fog) {
      this.scene.fog.color.setHex(horizon);
    } else {
      this.scene.fog = new THREE.Fog(horizon, 8, 19);
    }
  }

  private rebuildGround(vm: GardenViewModel): void {
    if (this.groundMesh) {
      this.scene.remove(this.groundMesh);
      disposeNode(this.groundMesh);
    }
    this.groundMesh = createGround(vm.timeOfDay);
    this.scene.add(this.groundMesh);
  }

  private rebuildPlants(vm: GardenViewModel): void {
    if (this.gardenGroup) {
      this.scene.remove(this.gardenGroup);
      this.gardenGroup.traverse(disposeNode);
    }
    this.gardenGroup = buildGarden(vm);
    this.plantsBornAt = this.clock.elapsedTime;
    this.scene.add(this.gardenGroup);
  }

  private rebuildEffects(vm: GardenViewModel): void {
    for (const effect of this.effects) {
      this.scene.remove(effect.object);
      effect.dispose();
    }
    this.effects = createEffects(vm.effects, this.options.quality);
    for (const effect of this.effects) this.scene.add(effect.object);
  }

  private handlePointer = (event: PointerEvent): void => {
    if (!this.gardenGroup || !this.onSelect) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const hits = this.raycaster.intersectObjects(this.gardenGroup.children, true);
    const first = hits[0];
    if (!first) return;

    // 向上回溯到带 recordId 的植物根 Group
    let node: THREE.Object3D | null = first.object;
    while (node && node.parent !== this.gardenGroup) {
      node = node.parent;
    }
    const data = node?.userData as PlantUserData | undefined;
    if (data?.recordId) this.onSelect(data.recordId);
  };

  private handleResize = (): void => {
    const width = this.container.clientWidth || 1;
    const height = this.container.clientHeight || 1;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  /** 逐帧：错峰绽放 + 轻柔摇曳 + 聚焦缩放（减少动态时全部静止） */
  private updatePlants(t: number): void {
    if (!this.gardenGroup) return;
    const sinceBorn = t - this.plantsBornAt;
    for (const child of this.gardenGroup.children) {
      const data = child.userData as PlantUserData;
      const target = this.focusedId !== null && data.recordId === this.focusedId ? 1.5 : 1;
      if (this.options.reducedMotion) {
        child.scale.setScalar(target);
        continue;
      }
      const bloom = easeOut(Math.min(Math.max((sinceBorn - data.bloomDelay) / BLOOM_DURATION, 0), 1));
      child.scale.setScalar(target * bloom);
      child.rotation.z = Math.sin(t + data.phase) * 0.04 * bloom;
    }
  }

  private loop = (): void => {
    this.rafId = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;

    this.updatePlants(t);
    if (!this.options.reducedMotion) {
      for (const effect of this.effects) effect.update(dt);
    }
    this.renderer.render(this.scene, this.camera);
  };

  /** 卸载：停循环、移监听、释放全部 GL 资源 */
  dispose(): void {
    cancelAnimationFrame(this.rafId);
    this.renderer.domElement.removeEventListener('pointerdown', this.handlePointer);
    window.removeEventListener('resize', this.handleResize);

    for (const effect of this.effects) {
      this.scene.remove(effect.object);
      effect.dispose();
    }
    this.effects = [];
    if (this.gardenGroup) this.gardenGroup.traverse(disposeNode);
    if (this.groundMesh) disposeNode(this.groundMesh);
    this.skyTexture?.dispose();

    this.renderer.dispose();
    if (this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
