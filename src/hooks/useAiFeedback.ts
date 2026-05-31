import { useCallback, useState } from 'react';
import type { AiAnalysis, CompanionQuote } from '@/types/ai';
import type { EmotionKey } from '@/types/mood';
import { analyzeEmotion, generateCompanion } from '@/services/ai/aiClient';

/**
 * AI 情绪分析 + 陪伴语编排。
 * 暴露 loading / degraded（降级标记），UI 据此提示「AI 打了个盹」。
 */
export function useAiFeedback() {
  const [analyzing, setAnalyzing] = useState(false);
  const [companionLoading, setCompanionLoading] = useState(false);
  const [degraded, setDegraded] = useState(false);

  /** 分析情绪，返回结果（失败已在 service 层兜底 mock） */
  const analyze = useCallback(
    async (emotions: EmotionKey[], description: string): Promise<AiAnalysis> => {
      setAnalyzing(true);
      try {
        const result = await analyzeEmotion(emotions, description);
        setDegraded(result.source === 'mock');
        return result.data;
      } finally {
        setAnalyzing(false);
      }
    },
    [],
  );

  /** 生成/刷新陪伴语 */
  const fetchCompanion = useCallback(
    async (emotions: EmotionKey[]): Promise<CompanionQuote> => {
      setCompanionLoading(true);
      try {
        const result = await generateCompanion(emotions);
        setDegraded(result.source === 'mock');
        return result.data;
      } finally {
        setCompanionLoading(false);
      }
    },
    [],
  );

  return { analyze, fetchCompanion, analyzing, companionLoading, degraded };
}
