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
