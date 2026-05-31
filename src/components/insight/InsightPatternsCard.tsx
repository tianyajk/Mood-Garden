import { motion } from 'framer-motion';

interface Props {
  patterns: string[];
}

export function InsightPatternsCard({ patterns }: Props) {
  return (
    <div className="paper-card rounded-2xl p-6">
      <h3 className="font-display text-h3 text-ink-900 mb-4">规律发现</h3>
      <ul className="flex flex-col gap-3">
        {patterns.map((pattern, i) => (
          <motion.li
            key={i}
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <span className="mt-1 text-xs shrink-0" style={{ color: '#A99BD4' }}>✦</span>
            <span className="text-body text-ink-600 leading-relaxed">{pattern}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
