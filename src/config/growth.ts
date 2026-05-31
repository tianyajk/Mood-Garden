import type { GardenStage } from '@/types/garden';

/**
 * 花园成长阶段阈值 单一数据源（需求文档 功能5 + 架构设计第七节）。
 * 阈值 = 触发该阶段所需的「累计记录天数」。
 */
export interface GrowthStageConfig {
  stage: GardenStage;
  label: string; // 中文名
  minDays: number; // 达到该天数即进入此阶段
  emoji: string;
}

/** 按阈值升序排列；派生时从后往前匹配第一个满足的阶段 */
export const GROWTH_STAGES: GrowthStageConfig[] = [
  { stage: 'seed', label: '一颗种子', minDays: 1, emoji: '🌱' },
  { stage: 'small', label: '小花园', minDays: 7, emoji: '🌿' },
  { stage: 'sea', label: '花海', minDays: 30, emoji: '🌸' },
  { stage: 'forest', label: '情绪森林', minDays: 100, emoji: '🌳' },
];

/** 由累计记录天数派生成长阶段（0 天也归为 seed，展示空花园由页面处理） */
export function deriveStage(recordedDays: number): GrowthStageConfig {
  let current = GROWTH_STAGES[0];
  for (const cfg of GROWTH_STAGES) {
    if (recordedDays >= cfg.minDays) {
      current = cfg;
    }
  }
  return current;
}
