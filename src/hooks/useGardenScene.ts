import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { GardenStage, GardenViewModel } from '@/types/garden';
import type { MoodRecord } from '@/types/mood';
import { SceneManager, type PlantSelectHandler } from '@/garden/core/SceneManager';
import { getEmotionConfig } from '@/config/emotions';
import { useMoodRecords } from './useMoodRecords';
import { useGardenStage } from './useGardenStage';
import { useDayCycle } from './useDayCycle';

const FALLBACK_COLOR = '#7FB89B';
const MAX_EFFECTS = 4;

/** 由记录派生引擎视图模型（纯函数）：每条记录一株，氛围取「来源」记录 */
function deriveViewModel(
  recordsAsc: MoodRecord[],
  source: MoodRecord | undefined,
  stage: GardenStage,
  clockTimeOfDay: GardenViewModel['timeOfDay'],
): GardenViewModel {
  const primaryKey = source?.emotions[0];
  const primaryCfg = primaryKey ? getEmotionConfig(primaryKey) : null;

  const plants = recordsAsc.map((r) => {
    const cfg = getEmotionConfig(r.emotions[0] ?? 'calm');
    return { recordId: r.id, date: r.date, plantTypes: cfg.plants, color: cfg.sceneColor };
  });

  const timeOfDay = primaryCfg?.timeOfDay ?? clockTimeOfDay; // 情绪偏好优先于时钟
  const effects = source
    ? Array.from(new Set(source.emotions.flatMap((k) => getEmotionConfig(k).effects))).slice(
        0,
        MAX_EFFECTS,
      )
    : [];
  // 夜晚必有萤火虫氛围
  if (timeOfDay === 'night' && !effects.includes('firefly')) {
    effects.push('firefly');
  }

  return {
    stage,
    timeOfDay,
    primaryColor: primaryCfg?.sceneColor ?? FALLBACK_COLOR,
    plants,
    effects,
  };
}

interface UseGardenSceneOptions {
  onPlantSelect?: PlantSelectHandler;
  focusRecordId?: string | null;
}

/**
 * React ↔ Three.js 引擎桥（架构：React 仅通过此 hook 与引擎通信）。
 * 持有 SceneManager 实例，挂载/卸载、推送视图模型、拾取回调、聚焦定位。
 */
export function useGardenScene(options: UseGardenSceneOptions = {}) {
  const { records } = useMoodRecords(); // 倒序（新→旧）
  const { stage } = useGardenStage();
  const { timeOfDay } = useDayCycle();
  const reduce = useReducedMotion();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const managerRef = useRef<SceneManager | null>(null);
  const [supported, setSupported] = useState(true);
  const [ready, setReady] = useState(false);

  const recordsAsc = useMemo(() => [...records].reverse(), [records]); // 时序稳定布局
  const source = records[0]; // 最新记录（今日若已记录即为今日）

  const viewModel = useMemo(
    () => deriveViewModel(recordsAsc, source, stage.stage, timeOfDay),
    [recordsAsc, source, stage.stage, timeOfDay],
  );

  // 初始化 / 销毁引擎
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // 移动端降低粒子与像素比，避免卡顿
    const quality = window.matchMedia('(max-width: 640px)').matches ? 0.5 : 1;
    try {
      managerRef.current = new SceneManager(el, { reducedMotion: reduce ?? false, quality });
      setReady(true);
    } catch {
      setSupported(false);
      return;
    }
    return () => {
      managerRef.current?.dispose();
      managerRef.current = null;
      setReady(false);
    };
  }, [reduce]);

  // 推送视图模型
  useEffect(() => {
    managerRef.current?.setViewModel(viewModel);
  }, [viewModel]);

  // 拾取回调
  useEffect(() => {
    managerRef.current?.setOnSelect(options.onPlantSelect ?? null);
  }, [options.onPlantSelect]);

  // 聚焦定位（viewModel 变更后需重应用）
  useEffect(() => {
    managerRef.current?.focus(options.focusRecordId ?? null);
  }, [options.focusRecordId, viewModel]);

  return { containerRef, supported, ready };
}
