import type { AiAnalysis, EmotionIntensity } from '@/types/ai';
import { cn } from '@/utils/cn';

interface AiAnalysisCardProps {
  analysis: AiAnalysis;
  accentColor?: string;
  className?: string;
}

const INTENSITY_DOTS: Record<EmotionIntensity, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

const INTENSITY_LABEL: Record<EmotionIntensity, string> = {
  low: '轻微',
  medium: '适中',
  high: '较强',
};

export function AiAnalysisCard({ analysis, accentColor, className }: AiAnalysisCardProps) {
  const filled = INTENSITY_DOTS[analysis.intensity];

  return (
    <div
      className={cn('paper-card rounded-xl p-5', className)}
      style={accentColor ? { borderLeftColor: accentColor, borderLeftWidth: '3px' } : undefined}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {analysis.keywords.map((kw) => (
          <span
            key={kw}
            className="rounded-lg px-2.5 py-1 text-caption"
            style={
              accentColor
                ? { backgroundColor: `${accentColor}18`, color: accentColor }
                : { backgroundColor: '#F5F0E8', color: '#8B7E6E' }
            }
          >
            {kw}
          </span>
        ))}
      </div>

      <p className="text-body text-ink-900 leading-relaxed">{analysis.feedback}</p>

      <div className="mt-3 flex items-center gap-2 text-caption text-ink-400">
        <span>情绪强度</span>
        <span className="text-ink-600 font-medium">{INTENSITY_LABEL[analysis.intensity]}</span>
        <span className="tracking-widest" style={accentColor ? { color: accentColor } : undefined}>
          {'●'.repeat(filled)}
          <span className="text-ink-400/30">{'●'.repeat(3 - filled)}</span>
        </span>
      </div>
    </div>
  );
}
