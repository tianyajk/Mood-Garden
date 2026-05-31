/** 情绪强度档位 */
export type EmotionIntensity = 'low' | 'medium' | 'high';

/** AI 情绪分析结果 */
export interface AiAnalysis {
  keywords: string[]; // 情绪关键词，如 ['紧张','期待','成长']
  intensity: EmotionIntensity; // 情绪强度
  feedback: string; // 简短反馈文案
}

/** 每日陪伴语 */
export interface CompanionQuote {
  text: string;
  generatedAt: number;
}

/** AI 服务统一返回（含降级标记） */
export interface AiResult<T> {
  data: T;
  source: 'api' | 'mock'; // mock 表示降级
}
