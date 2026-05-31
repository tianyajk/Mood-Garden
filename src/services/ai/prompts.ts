import type { EmotionKey, MoodRecord } from '@/types/mood';
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

/** 个人洞察 system prompt */
export const INSIGHT_SYSTEM_PROMPT =
  '你是一位温柔、有洞察力的情绪健康分析师。根据用户的情绪记录数据，生成个人情绪洞察报告。\n' +
  '必须严格输出 JSON（无任何其他文字）：\n' +
  '{"portrait":"基于全部记录的2-3句情绪特质描述，第二人称，温柔有洞见，不超过80字",' +
  '"weekSummary":"一句话描述近7天情绪状态，不超过40字，若近7天无记录则为null",' +
  '"monthSummary":"一句话描述近30天情绪状态，不超过40字，若近30天无记录则为null",' +
  '"patterns":["观察到的规律1","规律2","规律3"],' +
  '"suggestions":[{"title":"建议标题不超过6字","content":"具体建议不超过50字"}],' +
  '"encouragement":"一句温柔鼓励不超过30字"}\n' +
  'patterns 2-4条，suggestions 2-4条。';

function buildFreqStr(rs: MoodRecord[]): string {
  const freq: Map<EmotionKey, number> = new Map();
  let total = 0;
  for (const r of rs) for (const e of r.emotions) { freq.set(e, (freq.get(e) ?? 0) + 1); total++; }
  if (total === 0) return '暂无';
  return [...freq.entries()]
    .sort(([, a], [, b]) => b - a)
    .map(([k, n]) => `${getEmotionConfig(k).label}(${n}次,${Math.round((n / total) * 100)}%)`)
    .join('、');
}

/** 构建个人洞察的用户数据摘要 */
export function buildInsightSummary(
  records: MoodRecord[],
  meditationMinutes: number,
  streakDays: number,
): string {
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const firstDate = sorted[0]?.date ?? '—';
  const lastDate = sorted[sorted.length - 1]?.date ?? '—';
  const uniqueDays = new Set(sorted.map((r) => r.date)).size;

  const today = new Date();
  const weekCutoff = new Date(today); weekCutoff.setDate(today.getDate() - 7);
  const monthCutoff = new Date(today); monthCutoff.setDate(today.getDate() - 30);
  const weekStr = weekCutoff.toISOString().slice(0, 10);
  const monthStr = monthCutoff.toISOString().slice(0, 10);
  const weekRecords = records.filter((r) => r.date >= weekStr);
  const monthRecords = records.filter((r) => r.date >= monthStr);

  const recent = [...sorted].reverse().slice(0, 20);
  const recentStr = recent
    .map((r) => {
      const emos = r.emotions.map((e) => getEmotionConfig(e).label).join('+');
      const desc = r.description
        ? `${r.description.slice(0, 30)}${r.description.length > 30 ? '…' : ''}`
        : '';
      return desc ? `${r.date} [${emos}]: ${desc}` : `${r.date} [${emos}]`;
    })
    .join('\n');

  return [
    `总体时间范围：${firstDate} 至 ${lastDate}（${uniqueDays}天有记录，共${records.length}条）`,
    `连续打卡：${streakDays}天，累计冥想：${meditationMinutes}分钟`,
    `全部时间情绪分布：${buildFreqStr(records)}`,
    `近30天情绪分布（共${monthRecords.length}条）：${buildFreqStr(monthRecords)}`,
    `近7天情绪分布（共${weekRecords.length}条）：${buildFreqStr(weekRecords)}`,
    '',
    `最近${recent.length}条记录：`,
    recentStr,
  ].join('\n');
}
