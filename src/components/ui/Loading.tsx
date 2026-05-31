import { motion } from 'framer-motion';

interface LoadingProps {
  text?: string;
}

export function Loading({ text = '' }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="inline-block h-2 w-2 rounded-full bg-ink-400"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          />
        ))}
      </div>
      {text && <span className="text-caption text-ink-400">{text}</span>}
    </div>
  );
}
