import type { EmotionKey } from '@/types/mood';
import { getEmotionConfig } from '@/config/emotions';

/** 把情绪 key 列表转成中文标签串，供 prompt 注入 */
function emotionLabels(emotions: EmotionKey[]): string {
  return emotions.map((k) => getEmotionConfig(k).label).join('、') || '未指定';
}

/** 情绪分析 system prompt */
export const ANALYSIS_SYSTEM_PROMPT =
  '你是一个温柔、克制的情绪陪伴助手。请根据用户当天的情绪与描述，输出 JSON：' +
  '{"keywords":["关键词1","关键词2","关键词3"],"intensity":"low|medium|high","feedback":"一句温柔的反馈"}。' +
  '关键词 2-4 个，feedback 不超过 40 字，第二人称，不要感叹号轰炸。只输出 JSON，不要多余文字。';

/** 构造情绪分析 user prompt */
export function buildAnalysisPrompt(emotions: EmotionKey[], description: string): string {
  return `当天情绪：${emotionLabels(emotions)}\n用户描述：${description || '（无）'}`;
}

/** 陪伴语 system prompt */
export const COMPANION_SYSTEM_PROMPT =
  '你是一个治愈系情绪花园的陪伴者。请输出一句温柔、有诗意、不超过 30 字的中文陪伴语，' +
  '第二人称，安静而有力量。只输出这句话本身，不要引号、不要多余文字。';

/** 构造陪伴语 user prompt（可基于当天情绪个性化） */
export function buildCompanionPrompt(emotions: EmotionKey[]): string {
  if (emotions.length === 0) {
    return '请给出一句通用的、治愈的每日陪伴语。';
  }
  return `用户当天的情绪是：${emotionLabels(emotions)}。请给一句贴合此刻心情的陪伴语。`;
}
