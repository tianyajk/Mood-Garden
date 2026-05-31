import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeUp } from '@/config/theme';

interface SessionCompleteProps {
  minutes: number;
  completed: boolean;
  onAgain: () => void;
  onClose: () => void;
}

export function SessionComplete({ minutes, completed, onAgain, onClose }: SessionCompleteProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex w-full max-w-[320px] flex-col items-center gap-5 rounded-2xl bg-[#4A4540] p-8 text-center border border-white/10 shadow-lg"
      {...fadeUp}
    >
      <span className="text-5xl">🌿</span>
      <h2 className="font-display text-h2 text-white">
        {completed ? '这段时间属于你' : '提前结束也没关系'}
      </h2>
      <p className="text-body text-white/70">
        {minutes > 0 ? `你安静地待了 ${minutes} 分钟。` : '哪怕只是停下来一会儿，也是善待自己。'}
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onAgain}
          className="rounded-xl px-5 py-2.5 text-caption text-white/80 border border-white/20 hover:bg-white/10 transition-colors"
        >
          再来一次
        </button>
        <button
          onClick={() => { onClose(); navigate('/record'); }}
          className="rounded-xl px-5 py-2.5 text-caption text-white/80 border border-white/20 hover:bg-white/10 transition-colors"
        >
          记录心情 →
        </button>
        <button
          onClick={onClose}
          className="rounded-xl px-5 py-2.5 text-caption bg-white/15 text-white hover:bg-white/25 transition-colors"
        >
          完成
        </button>
      </div>
    </motion.div>
  );
}
