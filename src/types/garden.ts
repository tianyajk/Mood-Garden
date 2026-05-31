import type { EmotionKey } from './mood';

/** 成长阶段，由记录天数派生 */
export type GardenStage = 'seed' | 'small' | 'sea' | 'forest';
// seed: 1天 / small: 7天 / sea: 30天 / forest: 100天

/** 昼夜 / 天气偏好 */
export type TimeOfDay = 'day' | 'dusk' | 'night' | 'overcast';

/** 单种情绪的视觉配置（config/emotions.ts 的条目类型） */
export interface EmotionConfig {
  key: EmotionKey;
  label: string; // 中文名，如 '开心'
  emoji: string;
  color: string; // UI 强调色 hex（柔化版）
  bgColor: string; // 浅色背景 hex
  sceneColor: string; // 3D 场景原色（饱和度更高，Phase2 用）
  plants: string[]; // 植物元素 id
  effects: string[]; // 粒子/特效 id
  timeOfDay: TimeOfDay;
}

/** 引擎渲染所需的场景描述（由记录 + 配置派生，非持久化，Phase2 消费） */
export interface GardenScene {
  stage: GardenStage;
  emotions: EmotionKey[]; // 当天情绪
  plantCount: number; // 随累计天数增长
  primaryColor: string;
}

/** 单株植物的渲染模型（每条记录 → 一株，由记录派生，非持久化） */
export interface GardenPlantModel {
  recordId: string; // 关联记录 id，供 raycast 点击回溯
  date: string; // YYYY-MM-DD
  plantTypes: string[]; // 主情绪的植物元素 id
  color: string; // 主情绪 3D 场景原色 hex
}

/** 花园引擎视图模型（React → 引擎的唯一数据契约，整体派生重算） */
export interface GardenViewModel {
  stage: GardenStage;
  timeOfDay: TimeOfDay; // 昼夜，影响天空/灯光
  primaryColor: string; // 当天主色（地形/氛围）
  plants: GardenPlantModel[]; // 每条记录一株
  effects: string[]; // 当天激活的粒子/特效 id（去重）
}
