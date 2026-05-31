import { motion } from 'framer-motion';

interface LoadingProps {
  text?: string;
}

/** 全局加载占位（低保真原型 五·全局加载）：种子 + 生长文案 */
export function Loading({ text = '花园生长中…' }: LoadingProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-ink-600">
      <motion.span
        className="text-4xl"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        🌱
      </motion.span>
      <span className="text-caption">{text}</span>
    </div>
  );
}
