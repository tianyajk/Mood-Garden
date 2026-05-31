import type { AiAnalysis, EmotionIntensity } from '@/types/ai';
import { cn } from '@/utils/cn';

interface AiAnalysisCardProps {
  analysis: AiAnalysis;
  /** 当天情绪强调色，用于卡片描边（架构/视觉规范） */
  accentColor?: string;
  className?: string;
}

/** 强度档位 → 5 点填充数 */
const INTENSITY_DOTS: Record<EmotionIntensity, number> = {
  low: 2,
  medium: 3,
  high: 5,
};

/** AI 分析卡：关键词 / 强度点阵 / 反馈，描边取情绪色 */
export function AiAnalysisCard({ analysis, accentColor, className }: AiAnalysisCardProps) {
  const filled = INTENSITY_DOTS[analysis.intensity];

  return (
    <div
      className={cn('rounded-md border-2 bg-bg-elevated p-5 shadow-sm', className)}
      style={accentColor ? { borderColor: accentColor } : undefined}
    >
      <p className="mb-3 text-micro font-medium text-ink-400">AI 反馈</p>

      <div className="mb-3 flex flex-wrap gap-2">
        {analysis.keywords.map((kw) => (
          <span
            key={kw}
            className="rounded-full px-2.5 py-1 text-caption"
            style={
              accentColor
                ? { backgroundColor: `${accentColor}1A`, color: accentColor }
                : { backgroundColor: '#F1ECE6', color: '#6B655E' }
            }
          >
            {kw}
          </span>
        ))}
      </div>

      <div className="mb-3 flex items-center gap-1.5 text-caption text-ink-600">
        <span>强度</span>
        <span className="tracking-widest" style={accentColor ? { color: accentColor } : undefined}>
          {'●'.repeat(filled)}
          <span className="text-ink-400">{'○'.repeat(5 - filled)}</span>
        </span>
      </div>

      <p className="text-body text-ink-900">{analysis.feedback}</p>
    </div>
  );
}
