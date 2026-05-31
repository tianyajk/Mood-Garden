import { motion } from 'framer-motion';
import type { InsightSuggestion } from '@/types/ai';

interface Props {
  suggestions: InsightSuggestion[];
}

const ICON_MAP: Array<[string, string]> = [
  ['呼吸', '🌬️'],
  ['冥想', '🧘'],
  ['记录', '📝'],
  ['作息', '🌙'],
  ['联结', '🤝'],
  ['感恩', '🌸'],
  ['释放', '⚡'],
  ['当下', '🍃'],
  ['复制', '✨'],
  ['运动', '🏃'],
  ['睡眠', '😴'],
];

function getIcon(title: string): string {
  for (const [keyword, icon] of ICON_MAP) {
    if (title.includes(keyword)) return icon;
  }
  return '💡';
}

export function InsightSuggestionsCard({ suggestions }: Props) {
  return (
    <div className="paper-card rounded-2xl p-6">
      <h3 className="font-display text-h3 text-ink-900 mb-4">个性化建议</h3>
      <div className="flex flex-col gap-3">
        {suggestions.map((s, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-3 rounded-xl bg-bg-sunken p-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <span className="text-xl shrink-0 mt-0.5">{getIcon(s.title)}</span>
            <div>
              <p className="text-caption font-medium text-ink-900 mb-1">{s.title}</p>
              <p className="text-caption text-ink-600 leading-relaxed">{s.content}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
