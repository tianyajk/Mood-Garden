/** 情绪强度档位 */
export type EmotionIntensity = 'low' | 'medium' | 'high';

/** AI 情绪分析结果 */
export interface AiAnalysis {
  keywords: string[];
  intensity: EmotionIntensity;
  feedback: string;
}

/** 每日陪伴语 */
export interface CompanionQuote {
  text: string;
  generatedAt: number;
}

/** AI 服务统一返回（含降级标记） */
export interface AiResult<T> {
  data: T;
  source: 'api' | 'mock';
}

/** 个人洞察 - 单条建议 */
export interface InsightSuggestion {
  title: string;
  content: string;
}

/** 某段时期的情绪摘要（近7天 / 近30天） */
export interface PeriodSummary {
  recordCount: number;
  summary: string;
}

/** AI 个人情绪洞察报告 */
export interface AiInsight {
  portrait: string;
  week: PeriodSummary | null;
  month: PeriodSummary | null;
  patterns: string[];
  suggestions: InsightSuggestion[];
  encouragement: string;
  generatedAt: number;
  recordCount: number;
}
