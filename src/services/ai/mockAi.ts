import type { AiAnalysis, AiInsight, CompanionQuote, EmotionIntensity, InsightSuggestion, PeriodSummary } from '@/types/ai';
import type { EmotionKey, MoodRecord } from '@/types/mood';
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

const NEGATIVE_EMOTIONS: EmotionKey[] = ['anxious', 'sad', 'angry', 'lonely', 'confused'];
const POSITIVE_EMOTIONS: EmotionKey[] = ['happy', 'calm', 'excited'];

const INSIGHT_ENCOURAGEMENTS = [
  '每一次记录，都是你在温柔地接住自己。',
  '你已经走了很长的路，继续向前吧。',
  '情绪没有好坏，每一种都值得被看见。',
  '你愿意了解自己，这就是最好的开始。',
];

function buildPeriodSummaryMock(records: MoodRecord[], label: string): PeriodSummary | null {
  if (records.length === 0) return null;
  const freq = new Map<EmotionKey, number>();
  let total = 0;
  for (const r of records) for (const e of r.emotions) { freq.set(e, (freq.get(e) ?? 0) + 1); total++; }
  const sorted = [...freq.entries()].sort(([, a], [, b]) => b - a);
  const topKey = sorted[0]?.[0];
  const topLabel = topKey ? getEmotionConfig(topKey).label : '';
  const negCount = sorted.filter(([k]) => NEGATIVE_EMOTIONS.includes(k)).reduce((s, [, n]) => s + n, 0);
  const posCount = sorted.filter(([k]) => POSITIVE_EMOTIONS.includes(k)).reduce((s, [, n]) => s + n, 0);
  const secondLabel = sorted[1]?.[0] ? getEmotionConfig(sorted[1][0]).label : '';

  let summary: string;
  if (negCount > posCount * 1.5) {
    summary = `${label}你承受了较多压力，「${topLabel}」是主要情绪，记得多关注自己的感受。`;
  } else if (posCount > negCount * 1.5) {
    summary = `${label}状态不错，「${topLabel}」贯穿了大部分时光，继续保持这份轻盈。`;
  } else if (secondLabel) {
    summary = `${label}情绪较为丰富，「${topLabel}」与「${secondLabel}」交织，你在细腻地感受生活。`;
  } else {
    summary = `${label}主要以「${topLabel}」为主，情绪相对平稳。`;
  }
  return { recordCount: records.length, summary };
}

/** 降级版个人洞察：基于本地统计生成，无需 AI */
export function mockInsight(records: MoodRecord[], meditationMinutes: number): AiInsight {
  const freq = new Map<EmotionKey, number>();
  let total = 0;
  for (const r of records) {
    for (const e of r.emotions) {
      freq.set(e, (freq.get(e) ?? 0) + 1);
      total++;
    }
  }

  const sorted = [...freq.entries()].sort(([, a], [, b]) => b - a);
  const uniqueDays = new Set(records.map((r) => r.date)).size;
  const negCount = sorted.filter(([k]) => NEGATIVE_EMOTIONS.includes(k)).reduce((s, [, n]) => s + n, 0);
  const posCount = sorted.filter(([k]) => POSITIVE_EMOTIONS.includes(k)).reduce((s, [, n]) => s + n, 0);
  const topKeys = sorted.slice(0, 3).map(([k]) => k);
  const topLabels = topKeys.map((k) => getEmotionConfig(k).label);

  let portrait: string;
  if (topLabels.length === 0) {
    portrait = '你刚开始了情绪记录的旅程，每一条记录都是认识自己的开始。';
  } else if (negCount > posCount * 1.5) {
    portrait = `你是一个感受细腻的人，近期经历了较多${topLabels[0]}${topLabels[1] ? '和' + topLabels[1] : ''}的情绪。能坚持记录，说明你愿意正视内心，这本身就很勇敢。`;
  } else if (posCount > negCount * 1.5) {
    portrait = `你整体状态较为积极，${topLabels[0]}是你最常有的感受。你有着良好的情绪感知力，也懂得珍惜当下美好的时光。`;
  } else {
    portrait = `你的情绪丰富多元，${topLabels.join('、')}都是你的常客。你能包容自己各种情绪状态，这是一种成熟的自我接纳。`;
  }

  const patterns: string[] = [];
  if (sorted.length > 0 && total > 0) {
    const [topKey, topCount] = sorted[0];
    patterns.push(`「${getEmotionConfig(topKey).label}」是你最常出现的情绪，占记录的 ${Math.round((topCount / total) * 100)}%`);
  }
  if (negCount > 0 && posCount > 0) {
    const ratio = Math.round((posCount / (posCount + negCount)) * 100);
    if (ratio >= 60) {
      patterns.push(`你有 ${ratio}% 的时间保持着积极情绪，整体心态健康向好`);
    } else if (ratio <= 40) {
      patterns.push('近期承受了较多压力，多关注自己的情绪需求很重要');
    } else {
      patterns.push('积极与困难情绪大致各半，你能较好地接纳情绪起伏');
    }
  }
  if (uniqueDays >= 7) {
    patterns.push(`已坚持记录 ${uniqueDays} 天，规律记录帮助你更了解自己`);
  }
  if (meditationMinutes >= 60) {
    patterns.push(`累计冥想 ${meditationMinutes} 分钟，正在逐渐建立情绪稳定的基础`);
  }

  const suggestions = buildMockSuggestions(topKeys, negCount, posCount, meditationMinutes);
  const idx = Math.floor(Date.now() / 86400000) % INSIGHT_ENCOURAGEMENTS.length;

  const today = new Date();
  const weekCutoff = new Date(today); weekCutoff.setDate(today.getDate() - 7);
  const monthCutoff = new Date(today); monthCutoff.setDate(today.getDate() - 30);
  const weekStr = weekCutoff.toISOString().slice(0, 10);
  const monthStr = monthCutoff.toISOString().slice(0, 10);

  return {
    portrait,
    week: buildPeriodSummaryMock(records.filter((r) => r.date >= weekStr), '近7天'),
    month: buildPeriodSummaryMock(records.filter((r) => r.date >= monthStr), '近30天'),
    patterns: patterns.slice(0, 4),
    suggestions: suggestions.slice(0, 3),
    encouragement: INSIGHT_ENCOURAGEMENTS[idx],
    generatedAt: Date.now(),
    recordCount: records.length,
  };
}

function buildMockSuggestions(
  topKeys: EmotionKey[],
  negCount: number,
  posCount: number,
  meditationMinutes: number,
): InsightSuggestion[] {
  const all: InsightSuggestion[] = [];

  if (topKeys.includes('anxious')) {
    all.push({ title: '呼吸放松', content: '焦虑时尝试4-7-8呼吸：吸气4秒、屏息7秒、呼气8秒，重复3轮能有效平静神经系统。' });
  }
  if (topKeys.includes('sad') || topKeys.includes('lonely')) {
    all.push({ title: '主动联结', content: '感到难过时，联系一位信任的朋友聊聊，哪怕只说"最近不太好"，连接本身就是疗愈。' });
  }
  if (topKeys.includes('angry')) {
    all.push({ title: '释放情绪', content: '愤怒需要出口，可以快步走、写愤怒日记，或找安全的空间大声说出来。' });
  }
  if (topKeys.includes('confused')) {
    all.push({ title: '专注当下', content: '迷茫时不必强求答案，把注意力放在今天能做的一件小事上，行动会带来清晰感。' });
  }
  if (meditationMinutes < 30) {
    all.push({ title: '开始冥想', content: '每天5分钟冥想能有效降低焦虑感，哪怕很短也算坚持，重要的是规律。' });
  }
  if (negCount > posCount) {
    all.push({ title: '睡前感恩', content: '每晚记录3件今天感谢的小事，长期坚持能有效重塑大脑的积极回路。' });
  }
  if (topKeys.includes('happy') || topKeys.includes('calm')) {
    all.push({ title: '复制好状态', content: '回想让你感到开心或平静的是什么，有意识地在生活中多创造这类体验。' });
  }
  if (all.length < 2) {
    all.push({ title: '规律作息', content: '稳定的睡眠节律是情绪健康的基础，尝试每天在相同时间起床和入睡。' });
    all.push({ title: '坚持记录', content: '情绪记录是了解自己最温柔的方式，坚持下去会看到越来越清晰的自我。' });
  }

  return all;
}
