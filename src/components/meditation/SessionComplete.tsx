import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { fadeUp } from '@/config/theme';

interface SessionCompleteProps {
  minutes: number; // 本次完成分钟
  completed: boolean; // true=自然走完，false=提前结束
  onAgain: () => void;
  onClose: () => void;
}

/** 单次冥想完成卡：温柔反馈 + 记录心情 + 再来一次 / 完成 */
export function SessionComplete({ minutes, completed, onAgain, onClose }: SessionCompleteProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="glass flex w-full max-w-[360px] flex-col items-center gap-4 rounded-lg p-8 text-center text-white"
      {...fadeUp}
    >
      <span className="text-5xl">🌿</span>
      <h2 className="font-display text-h2">{completed ? '这段时间属于你' : '提前结束也没关系'}</h2>
      <p className="text-body text-white/85">
        {minutes > 0 ? `你安静地待了 ${minutes} 分钟。` : '哪怕只是停下来一会儿，也是善待自己。'}
      </p>
      <div className="mt-2 flex gap-3">
        <Button variant="glass" onClick={onAgain}>
          再来一次
        </Button>
        <Button variant="secondary" onClick={() => navigate('/record')}>
          记录心情 →
        </Button>
        <Button variant="primary" onClick={onClose}>
          完成
        </Button>
      </div>
    </motion.div>
  );
}
