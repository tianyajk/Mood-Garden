import type { EmotionKey } from './mood';
import type { AmbientKey } from './meditation';

/** 成长阶段，由记录天数派生 */
export type GardenStage = 'seed' | 'small' | 'sea' | 'forest';

/** 单种情绪的视觉配置（config/emotions.ts 的条目类型） */
export interface EmotionConfig {
  key: EmotionKey;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  sceneColor: string;
  plants: string[];
  effects: string[];
  timeOfDay: string;
  recommendedAmbient?: AmbientKey;
}
