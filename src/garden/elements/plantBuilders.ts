import * as THREE from 'three';

/**
 * 低多边形植物原型构建器（Ghibli 色温、flatShading）。
 * 每个原型返回独立 Group，几何/材质均新建，便于按株 dispose。
 */

/** 统一的低多边形材质 */
function lowPolyMat(color: THREE.ColorRepresentation): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.85, flatShading: true });
}

/** 细长绿茎 */
function makeStem(height: number): THREE.Mesh {
  const geo = new THREE.CylinderGeometry(0.03, 0.05, height, 5);
  const stem = new THREE.Mesh(geo, lowPolyMat(0x6fae84));
  stem.position.y = height / 2;
  return stem;
}

/** 花：茎 + 花心 + 环绕花瓣 */
export function createFlower(color: THREE.ColorRepresentation): THREE.Group {
  const group = new THREE.Group();
  const stemHeight = 0.7;
  group.add(makeStem(stemHeight));

  const center = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), lowPolyMat(0xf6e7c1));
  center.position.y = stemHeight;
  group.add(center);

  const petalGeo = new THREE.SphereGeometry(0.09, 6, 6);
  const petalCount = 6;
  for (let i = 0; i < petalCount; i += 1) {
    const petal = new THREE.Mesh(petalGeo.clone(), lowPolyMat(color));
    const a = (i / petalCount) * Math.PI * 2;
    petal.position.set(Math.cos(a) * 0.16, stemHeight, Math.sin(a) * 0.16);
    petal.scale.set(1, 0.5, 1);
    group.add(petal);
  }
  petalGeo.dispose();
  return group;
}

/** 荆棘：几束朝上的尖锥（焦虑） */
export function createThorn(color: THREE.ColorRepresentation): THREE.Group {
  const group = new THREE.Group();
  const spikeGeo = new THREE.ConeGeometry(0.06, 0.5, 5);
  for (let i = 0; i < 4; i += 1) {
    const spike = new THREE.Mesh(spikeGeo.clone(), lowPolyMat(color));
    const a = (i / 4) * Math.PI * 2;
    spike.position.set(Math.cos(a) * 0.1, 0.28 + Math.random() * 0.1, Math.sin(a) * 0.1);
    spike.rotation.z = (Math.random() - 0.5) * 0.4;
    group.add(spike);
  }
  spikeGeo.dispose();
  return group;
}

/** 树：树干 + 层叠锥形树冠（孤独·冬雪树） */
export function createTree(color: THREE.ColorRepresentation): THREE.Group {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.5, 6), lowPolyMat(0x9a7b5a));
  trunk.position.y = 0.25;
  group.add(trunk);

  const tiers = [
    { y: 0.6, r: 0.32 },
    { y: 0.85, r: 0.24 },
    { y: 1.05, r: 0.16 },
  ];
  for (const t of tiers) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(t.r, 0.32, 7), lowPolyMat(color));
    cone.position.y = t.y;
    group.add(cone);
  }
  return group;
}

/** 草丛：几片细叶（平静） */
export function createGrass(color: THREE.ColorRepresentation): THREE.Group {
  const group = new THREE.Group();
  const bladeGeo = new THREE.ConeGeometry(0.04, 0.4, 4);
  for (let i = 0; i < 5; i += 1) {
    const blade = new THREE.Mesh(bladeGeo.clone(), lowPolyMat(color));
    blade.position.set((Math.random() - 0.5) * 0.25, 0.2, (Math.random() - 0.5) * 0.25);
    blade.rotation.z = (Math.random() - 0.5) * 0.5;
    group.add(blade);
  }
  bladeGeo.dispose();
  return group;
}
