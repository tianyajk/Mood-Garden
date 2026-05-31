import type { AiAnalysis } from './ai';

/** 八种情绪枚举键，与 config/emotions.ts 对齐 */
export type EmotionKey =
  | 'happy'
  | 'calm'
  | 'excited'
  | 'anxious'
  | 'confused'
  | 'sad'
  | 'angry'
  | 'lonely';

/** 单条每日情绪记录（持久化单元） */
export interface MoodRecord {
  id: string; // uuid
  date: string; // YYYY-MM-DD，每天唯一
  emotions: EmotionKey[]; // 支持单选/多选
  description: string; // ≤300 字
  image?: string; // base64 图片（可选，≤5MB）
  aiAnalysis: AiAnalysis | null; // 未分析或降级时为 null
  createdAt: number; // 时间戳
}

/** 记录草稿（提交前的表单态，无 id/aiAnalysis） */
export type MoodDraft = Pick<MoodRecord, 'emotions' | 'description' | 'image'>;
