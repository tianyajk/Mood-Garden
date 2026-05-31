import type { AiAnalysis, CompanionQuote, EmotionIntensity } from '@/types/ai';
import type { EmotionKey } from '@/types/mood';
import { getEmotionConfig } from '@/config/emotions';

/**
 * 无 key 降级实现（架构原则：AI 可降级）。
 * 纯本地生成，保证无网络/无 key 也能完整演示。
 */

/** 各情绪的兜底关键词与反馈，第二人称、温柔 */
const ANALYSIS_BANK: Record<EmotionKey, { keywords: string[]; feedback: string }> = {
  happy: { keywords: ['愉悦', '满足', '明亮'], feedback: '你的开心也照亮了这片花园。' },
  calm: { keywords: ['安稳', '松弛', '从容'], feedback: '这份平静，是给自己最好的礼物。' },
  excited: { keywords: ['期待', '热烈', '心动'], feedback: '带着这份雀跃，去拥抱接下来的事吧。' },
  anxious: { keywords: ['紧张', '期待', '成长'], feedback: '焦虑背后，也藏着对未来的期待。' },
  confused: { keywords: ['迷茫', '探索', '等待'], feedback: '允许自己偶尔迷茫，也是成长的一部分。' },
  sad: { keywords: ['低落', '柔软', '休整'], feedback: '难过会过去，先好好抱抱自己。' },
  angry: { keywords: ['愤怒', '在意', '力量'], feedback: '愤怒说明你很在意，先深呼吸一下。' },
  lonely: { keywords: ['孤独', '安静', '自处'], feedback: '一个人的时候，也值得被温柔对待。' },
};

const COMPANION_BANK = [
  '允许自己偶尔迷茫，也是成长的一部分。',
  '这一刻的情绪，已经被看见了。',
  '慢一点没关系，花会按自己的节奏开。',
  '你不需要时刻坚强，柔软也是一种力量。',
  '今天也好好地，陪着自己。',
  '风会记得一朵花的香，时间会记得你的努力。',
  '把心放轻一点，花园一直在等你。',
];

/** 由情绪数量粗略派生强度 */
function deriveIntensity(emotions: EmotionKey[]): EmotionIntensity {
  if (emotions.length >= 3) return 'high';
  if (emotions.length === 2) return 'medium';
  return 'low';
}

/** 降级版情绪分析：以首个情绪为主，合并多选关键词 */
export function mockAnalyze(emotions: EmotionKey[], _description: string): AiAnalysis {
  const primary = emotions[0];
  if (!primary) {
    return { keywords: ['平和'], intensity: 'low', feedback: '记录下来，就是善待自己的开始。' };
  }
  const base = ANALYSIS_BANK[primary];
  const extra = emotions[1] ? ANALYSIS_BANK[emotions[1]].keywords[0] : null;
  const keywords = extra ? [...base.keywords.slice(0, 2), extra] : base.keywords;
  return {
    keywords,
    intensity: deriveIntensity(emotions),
    feedback: base.feedback,
  };
}

/** 降级版陪伴语：贴合首个情绪或随机 */
export function mockCompanion(emotions: EmotionKey[]): CompanionQuote {
  const primary = emotions[0];
  const text = primary
    ? `愿这份「${getEmotionConfig(primary).label}」，被温柔接住。`
    : COMPANION_BANK[Math.floor(Math.random() * COMPANION_BANK.length)];
  return { text, generatedAt: Date.now() };
}

/** 纯随机陪伴语（刷新用） */
export function mockRandomCompanion(): CompanionQuote {
  const text = COMPANION_BANK[Math.floor(Math.random() * COMPANION_BANK.length)];
  return { text, generatedAt: Date.now() };
}
