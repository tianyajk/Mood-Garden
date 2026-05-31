import { useMemo } from 'react';
import { deriveStage, type GrowthStageConfig } from '@/config/growth';
import { useGardenContext } from '@/context/GardenContext';

/**
 * 成长阶段派生（架构：派生而非存储）。
 * 暴露当前阶段配置 + 已记录天数，供时间轴底部概览/花园页消费。
 */
export function useGardenStage(): {
  stage: GrowthStageConfig;
  recordedDays: number;
} {
  const { state } = useGardenContext();

  return useMemo(() => {
    const recordedDays = state.records.length;
    return { stage: deriveStage(recordedDays), recordedDays };
  }, [state.records.length]);
}
