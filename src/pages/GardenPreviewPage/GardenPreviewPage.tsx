import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sunflower,
  CalmFlowers,
  ExcitedBurst,
  AnxiousThorn,
  ConfusedBell,
  SadMoonflower,
  AngryLily,
  LonelyTree,
} from '@/components/garden-preview/Plants';

type PlantKey =
  | 'sunflower'
  | 'calm'
  | 'excited'
  | 'anxious'
  | 'confused'
  | 'sad'
  | 'angry'
  | 'lonely';

const PlantMap = {
  sunflower: Sunflower,
  calm: CalmFlowers,
  excited: ExcitedBurst,
  anxious: AnxiousThorn,
  confused: ConfusedBell,
  sad: SadMoonflower,
  angry: AngryLily,
  lonely: LonelyTree,
} as const;

interface Placement {
  kind: PlantKey;
  left: string;
  bottom: string;
  scale: number;
  delay: number;
  z: number;
}

// 由远到近，scale 越小越远
const scene: Placement[] = [
  // 背景（远山线上）
  { kind: 'lonely', left: '6%', bottom: '24%', scale: 0.6, delay: 0.0, z: 1 },
  { kind: 'sad', left: '82%', bottom: '25%', scale: 0.55, delay: 1.2, z: 1 },
  { kind: 'confused', left: '46%', bottom: '23%', scale: 0.55, delay: 0.9, z: 1 },
  // 中景
  { kind: 'sunflower', left: '24%', bottom: '12%', scale: 0.8, delay: 0.5, z: 3 },
  { kind: 'angry', left: '64%', bottom: '13%', scale: 0.78, delay: 0.3, z: 3 },
  { kind: 'anxious', left: '16%', bottom: '11%', scale: 0.7, delay: 1.5, z: 3 },
  { kind: 'confused', left: '52%', bottom: '14%', scale: 0.72, delay: 1.0, z: 3 },
  { kind: 'excited', left: '74%', bottom: '10%', scale: 0.8, delay: 0.8, z: 4 },
  // 前景
  { kind: 'calm', left: '2%', bottom: '0%', scale: 1.15, delay: 0.6, z: 5 },
  { kind: 'sunflower', left: '14%', bottom: '0%', scale: 1.0, delay: 0.2, z: 5 },
  { kind: 'calm', left: '36%', bottom: '0%', scale: 1.1, delay: 0.4, z: 5 },
  { kind: 'sad', left: '54%', bottom: '0%', scale: 0.95, delay: 1.1, z: 5 },
  { kind: 'sunflower', left: '70%', bottom: '0%', scale: 1.0, delay: 1.4, z: 5 },
  { kind: 'calm', left: '84%', bottom: '0%', scale: 1.1, delay: 0.7, z: 5 },
];

export function GardenPreviewPage() {
  const reduce = useReducedMotion();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 天空 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #F5E8D8 0%, #F2DDC8 30%, #EBD6BE 55%, #D8C0A0 75%, #C9AE88 100%)',
        }}
      />

      {/* 暖阳光晕 */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: '68%',
          top: '12%',
          width: 180,
          height: 180,
          background:
            'radial-gradient(circle, rgba(248,222,178,0.75) 0%, rgba(248,222,178,0) 70%)',
        }}
        animate={reduce ? undefined : { scale: [1, 1.06, 1], opacity: [0.7, 0.95, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 远山 */}
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1200 320"
        preserveAspectRatio="none"
        style={{ height: '38%' }}
      >
        <defs>
          <linearGradient id="hill-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D0B898" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#B89878" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="hill-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A89878" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#8B7A5A" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path d="M0,210 Q300,130 600,180 T1200,160 L1200,320 L0,320 Z" fill="url(#hill-far)" />
        <path d="M0,260 Q200,210 500,240 T1000,230 T1200,220 L1200,320 L0,320 Z" fill="url(#hill-near)" />
      </svg>

      {/* 地面渐变（近景柔化） */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '20%',
          background:
            'linear-gradient(180deg, rgba(140,118,86,0) 0%, rgba(120,98,68,0.35) 60%, rgba(96,78,52,0.5) 100%)',
        }}
      />

      {/* 植物 */}
      <div className="absolute inset-0">
        {scene.map((p, i) => {
          const Plant = PlantMap[p.kind];
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: p.left,
                bottom: p.bottom,
                transform: `scale(${p.scale})`,
                transformOrigin: 'bottom center',
                zIndex: p.z,
              }}
            >
              <Plant reduce={reduce} delay={p.delay} />
            </div>
          );
        })}
      </div>

      {/* 飘浮光粒（萤火/花粉） */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 6 }}>
        {Array.from({ length: 18 }).map((_, i) => {
          const palette = ['#F5C97E', '#FFFDF5', '#E8C547', '#F2A6A0'];
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${(i * 7.3) % 100}%`,
                top: `${15 + ((i * 11) % 65)}%`,
                width: 6,
                height: 6,
                background: palette[i % palette.length],
                opacity: 0.55,
                filter: 'blur(1.5px)',
              }}
              animate={
                reduce
                  ? undefined
                  : {
                      y: [0, -18, 0],
                      opacity: [0.3, 0.85, 0.3],
                    }
              }
              transition={{
                duration: 4 + (i % 3),
                delay: i * 0.25,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      {/* 顶部标题 */}
      <div className="relative z-20 px-6 pt-8">
        <button
          onClick={() => navigate('/')}
          className="text-caption text-ink-600 hover:text-ink-900 transition-colors"
        >
          ← 返回
        </button>
        <div className="mt-6 text-center max-w-xl mx-auto">
          <h1 className="font-display text-h1 text-ink-900">情绪花园 · 水彩草稿</h1>
          <p className="mt-2 font-display italic text-body text-ink-600">
            每一种情绪，都长成一株植物
          </p>
        </div>
      </div>

      {/* 图例 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full px-4 flex justify-center">
        <div className="paper-card rounded-xl px-4 py-2 text-micro text-ink-600 flex flex-wrap gap-x-4 gap-y-1 justify-center max-w-md">
          <span>🌻 开心</span>
          <span>🌿 平静</span>
          <span>✨ 兴奋</span>
          <span>🌧️ 焦虑</span>
          <span>🌫️ 迷茫</span>
          <span>🌙 难过</span>
          <span>⚡ 愤怒</span>
          <span>❄️ 孤独</span>
        </div>
      </div>
    </div>
  );
}
