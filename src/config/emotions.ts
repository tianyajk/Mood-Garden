import type { EmotionConfig } from '@/types/garden';
import type { EmotionKey } from '@/types/mood';

/**
 * 八情绪 → 花园元素 单一数据源（架构设计.md 第六节 + 视觉设计.md 1.3）。
 * 新增/调整情绪只改此文件。
 * - color/bgColor：UI 柔化版（选中态、卡片填充）。
 * - sceneColor：3D 场景饱和原色（Phase2 引擎消费）。
 * - recommendedAmbient：推荐冥想音景（可选，方案C 情绪→白噪音）。
 */
export const EMOTIONS: Record<EmotionKey, EmotionConfig> = {
  happy: {
    key: 'happy',
    label: '开心',
    emoji: '😊',
    color: '#F2C45A',
    bgColor: '#FBF1D6',
    sceneColor: '#F6C453',
    plants: ['sunflower'],
    effects: ['gold-spark', 'butterfly'],
    timeOfDay: 'day',
  },
  calm: {
    key: 'calm',
    label: '平静',
    emoji: '🍃',
    color: '#8BC79A',
    bgColor: '#E6F2E9',
    sceneColor: '#8BC79A',
    plants: ['white-flower', 'grass'],
    effects: ['breeze'],
    timeOfDay: 'day',
    recommendedAmbient: 'stream',
  },
  excited: {
    key: 'excited',
    label: '兴奋',
    emoji: '✨',
    color: '#F58FB4',
    bgColor: '#FCE6EF',
    sceneColor: '#FF7AB6',
    plants: ['firework-flower'],
    effects: ['rainbow', 'sparkle'],
    timeOfDay: 'dusk',
  },
  anxious: {
    key: 'anxious',
    label: '焦虑',
    emoji: '🌧️',
    color: '#6E9BD1',
    bgColor: '#E3ECF7',
    sceneColor: '#5C8AC2',
    plants: ['blue-thorn'],
    effects: ['rain', 'fog'],
    timeOfDay: 'overcast',
    recommendedAmbient: 'rain',
  },
  confused: {
    key: 'confused',
    label: '迷茫',
    emoji: '🌫️',
    color: '#A78BC2',
    bgColor: '#EEE7F4',
    sceneColor: '#A78BC2',
    plants: ['purple-flower-sea'],
    effects: ['floating-cloud'],
    timeOfDay: 'dusk',
    recommendedAmbient: 'ocean',
  },
  sad: {
    key: 'sad',
    label: '难过',
    emoji: '🌙',
    color: '#5E6E9E',
    bgColor: '#E5E8F2',
    sceneColor: '#3E4C6B',
    plants: ['moonlight-flower'],
    effects: ['firefly'],
    timeOfDay: 'night',
    recommendedAmbient: 'ocean',
  },
  angry: {
    key: 'angry',
    label: '愤怒',
    emoji: '⚡',
    color: '#D9776F',
    bgColor: '#F7E3E1',
    sceneColor: '#D9534F',
    plants: ['red-spider-lily'],
    effects: ['flame'],
    timeOfDay: 'dusk',
    recommendedAmbient: 'stream',
  },
  lonely: {
    key: 'lonely',
    label: '孤独',
    emoji: '❄️',
    color: '#9FC8D6',
    bgColor: '#E7F2F5',
    sceneColor: '#9FC8D6',
    plants: ['snow-tree'],
    effects: ['cold-glow', 'snow'],
    timeOfDay: 'night',
    recommendedAmbient: 'forest',
  },
};

/** 固定顺序的情绪列表，供选择网格与时间轴展示复用 */
export const EMOTION_LIST: EmotionConfig[] = [
  EMOTIONS.happy,
  EMOTIONS.calm,
  EMOTIONS.excited,
  EMOTIONS.anxious,
  EMOTIONS.confused,
  EMOTIONS.sad,
  EMOTIONS.angry,
  EMOTIONS.lonely,
];

/** 按 key 取配置（带类型守卫，杜绝 undefined 漏判） */
export function getEmotionConfig(key: EmotionKey): EmotionConfig {
  return EMOTIONS[key];
}
