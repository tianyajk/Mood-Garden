import type { AiAnalysis, AiInsight, AiResult, CompanionQuote, EmotionIntensity, InsightSuggestion, PeriodSummary } from '@/types/ai';
import type { EmotionKey, MoodRecord } from '@/types/mood';
import {
  ANALYSIS_SYSTEM_PROMPT,
  COMPANION_SYSTEM_PROMPT,
  INSIGHT_SYSTEM_PROMPT,
  buildAnalysisPrompt,
  buildCompanionPrompt,
  buildInsightSummary,
} from './prompts';
import { mockAnalyze, mockCompanion, mockInsight, mockRandomCompanion } from './mockAi';

/**
 * 大模型请求封装（架构原则：所有 AI 调用走此处，可降级）。
 * 缺少 baseURL/key 时直接走 mock；请求异常也兜底 mock，绝不抛给 UI。
 */

const BASE_URL = import.meta.env.VITE_AI_BASE_URL ?? '';
const API_KEY = import.meta.env.VITE_AI_API_KEY ?? '';
const MODEL = import.meta.env.VITE_AI_MODEL ?? 'gpt-4o-mini';
const TIMEOUT_MS = 12000;

/** 是否具备真实调用条件 */
function isConfigured(): boolean {
  return BASE_URL.length > 0 && API_KEY.length > 0;
}

interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

/** 调一次 Chat Completions，返回首条消息文本 */
async function chat(messages: ChatMessage[]): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ model: MODEL, messages, temperature: 0.8 }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`AI HTTP ${res.status}`);
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error('AI empty response');
    return content;
  } finally {
    clearTimeout(timer);
  }
}

const VALID_INTENSITY: EmotionIntensity[] = ['low', 'medium', 'high'];

/** 解析分析 JSON，字段缺失/非法时抛错由上层兜底 mock */
function parseAnalysis(raw: string): AiAnalysis {
  const cleaned = raw.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned) as Partial<AiAnalysis>;
  const keywords = Array.isArray(parsed.keywords)
    ? parsed.keywords.filter((k): k is string => typeof k === 'string')
    : [];
  const intensity: EmotionIntensity = VALID_INTENSITY.includes(parsed.intensity as EmotionIntensity)
    ? (parsed.intensity as EmotionIntensity)
    : 'medium';
  if (keywords.length === 0 || typeof parsed.feedback !== 'string') {
    throw new Error('AI analysis shape invalid');
  }
  return { keywords, intensity, feedback: parsed.feedback };
}

/** 情绪分析：失败自动降级 */
export async function analyzeEmotion(
  emotions: EmotionKey[],
  description: string,
): Promise<AiResult<AiAnalysis>> {
  if (!isConfigured()) {
    return { data: mockAnalyze(emotions, description), source: 'mock' };
  }
  try {
    const text = await chat([
      { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
      { role: 'user', content: buildAnalysisPrompt(emotions, description) },
    ]);
    return { data: parseAnalysis(text), source: 'api' };
  } catch {
    return { data: mockAnalyze(emotions, description), source: 'mock' };
  }
}

/** 解析个人洞察 JSON，字段缺失时抛错由上层兜底 */
function parseInsight(
  raw: string,
  recordCount: number,
  weekCount: number,
  monthCount: number,
): AiInsight {
  const cleaned = raw.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned) as Partial<{
    portrait: string;
    weekSummary: string | null;
    monthSummary: string | null;
    patterns: string[];
    suggestions: Array<{ title?: string; content?: string }>;
    encouragement: string;
  }>;

  if (typeof parsed.portrait !== 'string') throw new Error('invalid portrait');
  const patterns = Array.isArray(parsed.patterns)
    ? parsed.patterns.filter((p): p is string => typeof p === 'string')
    : [];
  const suggestions: InsightSuggestion[] = Array.isArray(parsed.suggestions)
    ? parsed.suggestions
        .filter((s) => typeof s?.title === 'string' && typeof s?.content === 'string')
        .map((s) => ({ title: s.title as string, content: s.content as string }))
    : [];
  if (patterns.length === 0 || suggestions.length === 0) throw new Error('invalid insight shape');

  const toSummary = (text: string | null | undefined, count: number): PeriodSummary | null =>
    typeof text === 'string' && count > 0 ? { recordCount: count, summary: text } : null;

  return {
    portrait: parsed.portrait,
    week: toSummary(parsed.weekSummary, weekCount),
    month: toSummary(parsed.monthSummary, monthCount),
    patterns,
    suggestions,
    encouragement:
      typeof parsed.encouragement === 'string'
        ? parsed.encouragement
        : '继续温柔地记录，花园会见证你的每一次成长。',
    generatedAt: Date.now(),
    recordCount,
  };
}

/** 个人情绪洞察分析：失败自动降级 */
export async function analyzePersonalInsight(
  records: MoodRecord[],
  meditationMinutes: number,
  streakDays: number,
): Promise<AiResult<AiInsight>> {
  const today = new Date();
  const weekCutoff = new Date(today); weekCutoff.setDate(today.getDate() - 7);
  const monthCutoff = new Date(today); monthCutoff.setDate(today.getDate() - 30);
  const weekStr = weekCutoff.toISOString().slice(0, 10);
  const monthStr = monthCutoff.toISOString().slice(0, 10);
  const weekCount = records.filter((r) => r.date >= weekStr).length;
  const monthCount = records.filter((r) => r.date >= monthStr).length;

  if (!isConfigured()) {
    return { data: mockInsight(records, meditationMinutes), source: 'mock' };
  }
  try {
    const summary = buildInsightSummary(records, meditationMinutes, streakDays);
    const text = await chat([
      { role: 'system', content: INSIGHT_SYSTEM_PROMPT },
      { role: 'user', content: summary },
    ]);
    return { data: parseInsight(text, records.length, weekCount, monthCount), source: 'api' };
  } catch {
    return { data: mockInsight(records, meditationMinutes), source: 'mock' };
  }
}

/** 生成陪伴语：失败自动降级 */
export async function generateCompanion(
  emotions: EmotionKey[],
): Promise<AiResult<CompanionQuote>> {
  if (!isConfigured()) {
    return { data: mockCompanion(emotions), source: 'mock' };
  }
  try {
    const text = await chat([
      { role: 'system', content: COMPANION_SYSTEM_PROMPT },
      { role: 'user', content: buildCompanionPrompt(emotions) },
    ]);
    const clean = text.replace(/[「」""']/g, '').trim();
    if (!clean) throw new Error('AI companion empty');
    return { data: { text: clean, generatedAt: Date.now() }, source: 'api' };
  } catch {
    return { data: mockRandomCompanion(), source: 'mock' };
  }
}
