import { motion } from 'framer-motion';

interface PlantProps {
  reduce?: boolean | null;
  delay?: number;
  duration?: number;
}

const sway = { rotate: [-1.4, 1.4, -1.4] };

const swayTransition = (duration: number, delay: number) => ({
  duration,
  delay,
  repeat: Infinity,
  ease: 'easeInOut' as const,
});

const wrapperStyle = { transformOrigin: 'bottom center' as const };

// 1. 开心 · 向日葵
export function Sunflower({ reduce, delay = 0, duration = 5.5 }: PlantProps) {
  return (
    <motion.svg
      width="90"
      height="180"
      viewBox="0 0 90 180"
      style={wrapperStyle}
      animate={reduce ? undefined : sway}
      transition={swayTransition(duration, delay)}
    >
      <path d="M45 178 Q43 110 45 40" stroke="#6B8E4E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="32" cy="120" rx="14" ry="5" fill="#88A876" opacity="0.7" transform="rotate(-30 32 120)" />
      <ellipse cx="58" cy="85" rx="14" ry="5" fill="#88A876" opacity="0.7" transform="rotate(40 58 85)" />
      <g transform="translate(45 38)">
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-18"
            rx="7"
            ry="14"
            fill="#E8C547"
            opacity="0.85"
            transform={`rotate(${i * 30})`}
          />
        ))}
        <circle r="11" fill="#8B5E34" />
        <circle r="8" fill="#5A3D22" opacity="0.5" />
      </g>
    </motion.svg>
  );
}

// 2. 平静 · 草地 + 白色小花
export function CalmFlowers({ reduce, delay = 0, duration = 4.5 }: PlantProps) {
  const blades = [20, 35, 55, 78, 95, 105];
  const flowers: Array<[number, number]> = [
    [28, 60],
    [62, 50],
    [92, 65],
  ];
  return (
    <motion.svg
      width="120"
      height="90"
      viewBox="0 0 120 90"
      style={wrapperStyle}
      animate={reduce ? undefined : sway}
      transition={swayTransition(duration, delay)}
    >
      {blades.map((x, i) => (
        <path
          key={i}
          d={`M${x} 88 Q${x + 2} ${60 - (i % 3) * 8} ${x + 4} ${45 - (i % 3) * 10}`}
          stroke="#A4B891"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />
      ))}
      {flowers.map(([cx, cy], idx) => (
        <g key={idx} transform={`translate(${cx} ${cy})`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse
              key={i}
              cx="0"
              cy="-5"
              rx="3.5"
              ry="5"
              fill="#FFFDF5"
              opacity="0.95"
              transform={`rotate(${i * 72})`}
            />
          ))}
          <circle r="1.8" fill="#E8C547" />
        </g>
      ))}
    </motion.svg>
  );
}

// 3. 兴奋 · 烟花花
export function ExcitedBurst({ reduce, delay = 0, duration = 5 }: PlantProps) {
  const burstColors = ['#F2A6A0', '#F5C97E', '#F4B6CB'];
  return (
    <motion.svg
      width="100"
      height="160"
      viewBox="0 0 100 160"
      style={wrapperStyle}
      animate={reduce ? undefined : sway}
      transition={swayTransition(duration, delay)}
    >
      <path d="M50 160 Q48 100 50 50" stroke="#9A7A4A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <g transform="translate(50 48)">
        {Array.from({ length: 16 }).map((_, i) => (
          <line
            key={`r-${i}`}
            x1="0"
            y1="0"
            x2="0"
            y2="-30"
            stroke={burstColors[i % 3]}
            strokeWidth="2.5"
            strokeLinecap="round"
            transform={`rotate(${i * (360 / 16)})`}
            opacity="0.85"
          />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <circle
            key={`d-${i}`}
            cx="0"
            cy="-32"
            r="2"
            fill="#F5C97E"
            transform={`rotate(${i * (360 / 16)})`}
            opacity="0.9"
          />
        ))}
        <circle r="5" fill="#F5C97E" />
      </g>
    </motion.svg>
  );
}

// 4. 焦虑 · 蓝色荆棘
export function AnxiousThorn({ reduce, delay = 0, duration = 6 }: PlantProps) {
  return (
    <motion.svg
      width="80"
      height="160"
      viewBox="0 0 80 160"
      style={wrapperStyle}
      animate={reduce ? undefined : sway}
      transition={swayTransition(duration, delay)}
    >
      <path
        d="M40 158 L42 130 L36 110 L44 90 L36 70 L44 50 L40 25"
        stroke="#6E85A0"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M42 130 L52 122" stroke="#6E85A0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M36 110 L26 104" stroke="#6E85A0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M44 90 L54 84" stroke="#6E85A0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M36 70 L26 64" stroke="#6E85A0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M44 50 L54 44" stroke="#6E85A0" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="36" cy="80" rx="4" ry="2" fill="#4A5C7D" opacity="0.6" transform="rotate(-30 36 80)" />
      <ellipse cx="46" cy="60" rx="4" ry="2" fill="#4A5C7D" opacity="0.6" transform="rotate(40 46 60)" />
    </motion.svg>
  );
}

// 5. 迷茫 · 紫色铃铛花
export function ConfusedBell({ reduce, delay = 0, duration = 5.5 }: PlantProps) {
  return (
    <motion.svg
      width="80"
      height="170"
      viewBox="0 0 80 170"
      style={wrapperStyle}
      animate={reduce ? undefined : sway}
      transition={swayTransition(duration, delay)}
    >
      <path d="M40 168 Q30 130 45 100 Q60 70 38 40" stroke="#8A6FAA" strokeWidth="2" strokeLinecap="round" fill="none" />
      <g transform="translate(45 100)">
        <path d="M-6 0 Q-6 10 0 12 Q6 10 6 0 Z" fill="#B59ECC" opacity="0.88" />
        <ellipse cx="0" cy="13" rx="2" ry="1.5" fill="#8A6FAA" opacity="0.7" />
      </g>
      <g transform="translate(58 75)">
        <path d="M-5 0 Q-5 8 0 10 Q5 8 5 0 Z" fill="#C9B3DA" opacity="0.85" />
      </g>
      <g transform="translate(38 42)">
        <path d="M-6 0 Q-6 10 0 12 Q6 10 6 0 Z" fill="#B59ECC" opacity="0.88" />
        <ellipse cx="0" cy="13" rx="2" ry="1.5" fill="#8A6FAA" opacity="0.7" />
      </g>
    </motion.svg>
  );
}

// 6. 难过 · 月光花（低垂）
export function SadMoonflower({ reduce, delay = 0, duration = 6.5 }: PlantProps) {
  return (
    <motion.svg
      width="80"
      height="160"
      viewBox="0 0 80 160"
      style={wrapperStyle}
      animate={reduce ? undefined : sway}
      transition={swayTransition(duration, delay)}
    >
      <path d="M40 158 Q40 100 50 60 Q55 45 50 30" stroke="#7A8FB8" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <ellipse cx="32" cy="120" rx="10" ry="3" fill="#9AAFC8" opacity="0.55" transform="rotate(-30 32 120)" />
      <g transform="translate(50 30) rotate(15)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-9"
            rx="5"
            ry="10"
            fill="#D4D8E8"
            opacity="0.85"
            transform={`rotate(${i * 60})`}
          />
        ))}
        <circle r="3" fill="#7A8FB8" />
      </g>
    </motion.svg>
  );
}

// 7. 愤怒 · 彼岸花
export function AngryLily({ reduce, delay = 0, duration = 5 }: PlantProps) {
  return (
    <motion.svg
      width="90"
      height="170"
      viewBox="0 0 90 170"
      style={wrapperStyle}
      animate={reduce ? undefined : sway}
      transition={swayTransition(duration, delay)}
    >
      <path d="M45 168 Q43 110 45 50" stroke="#5C6B3E" strokeWidth="2" strokeLinecap="round" fill="none" />
      <g transform="translate(45 48)">
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={`p-${i}`}
            d="M0 0 Q8 -18 4 -30 Q2 -36 -2 -32"
            stroke="#C2615A"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            transform={`rotate(${i * 45})`}
            opacity="0.9"
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`l-${i}`}
            x1="0"
            y1="0"
            x2="0"
            y2="-32"
            stroke="#8B3E37"
            strokeWidth="1"
            transform={`rotate(${i * 45})`}
            opacity="0.6"
          />
        ))}
        <circle r="2.5" fill="#8B3E37" />
      </g>
    </motion.svg>
  );
}

// 8. 孤独 · 冬雪树
export function LonelyTree({ reduce, delay = 0, duration = 7 }: PlantProps) {
  return (
    <motion.svg
      width="120"
      height="200"
      viewBox="0 0 120 200"
      style={wrapperStyle}
      animate={reduce ? undefined : sway}
      transition={swayTransition(duration, delay)}
    >
      <path d="M60 200 Q58 140 60 90 Q62 60 60 30" stroke="#8A95A4" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M60 130 Q40 120 30 100" stroke="#8A95A4" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M60 110 Q80 100 90 80" stroke="#8A95A4" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M60 85 Q45 75 38 55" stroke="#8A95A4" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M60 70 Q75 60 82 42" stroke="#8A95A4" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M60 50 Q55 38 60 28" stroke="#8A95A4" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="30" cy="100" r="3" fill="#FFFDF5" opacity="0.95" />
      <circle cx="90" cy="80" r="3" fill="#FFFDF5" opacity="0.95" />
      <circle cx="38" cy="55" r="2.5" fill="#FFFDF5" opacity="0.95" />
      <circle cx="82" cy="42" r="2.5" fill="#FFFDF5" opacity="0.95" />
      <circle cx="60" cy="28" r="2.5" fill="#FFFDF5" opacity="0.95" />
    </motion.svg>
  );
}
