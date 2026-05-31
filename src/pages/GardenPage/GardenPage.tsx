import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { AiAnalysisCard } from '@/components/feedback/AiAnalysisCard';
import { CompanionQuote } from '@/components/feedback/CompanionQuote';
import { GardenPlaceholder } from '@/pages/GardenPage/GardenPlaceholder';
import { EmptyGarden } from '@/pages/GardenPage/EmptyGarden';
import { useMoodRecords } from '@/hooks/useMoodRecords';
import { useAiFeedback } from '@/hooks/useAiFeedback';
import { getEmotionConfig } from '@/config/emotions';
import { formatShortDate, toDateKey } from '@/utils/date';

/**
 * 花园展示页（Phase1 版）：2D 占位舞台 + AI 反馈 + 陪伴语。
 * 注意：Three.js 3D 花园引擎属于 Phase2，本页仅占位，不在此实现。
 */
export function GardenPage() {
  const navigate = useNavigate();
  const { todayRecord, hydrated } = useMoodRecords();
  const { fetchCompanion, companionLoading } = useAiFeedback();
  const [quote, setQuote] = useState('');

  const emotions = todayRecord?.emotions ?? [];
  const accent = emotions[0] ? getEmotionConfig(emotions[0]).color : undefined;

  // 进入时按当天情绪生成陪伴语
  useEffect(() => {
    let alive = true;
    fetchCompanion(emotions).then((c) => {
      if (alive) setQuote(c.text);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayRecord?.id]);

  const refresh = () => {
    fetchCompanion(emotions).then((c) => setQuote(c.text));
  };

  // 空花园：已 hydrate 且今天未记录
  if (hydrated && !todayRecord) {
    return <EmptyGarden onSeed={() => navigate('/record')} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-sky-day">
      {/* 顶部浮条 */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4">
        <span className="glass rounded-full px-4 py-1.5 text-caption text-ink-900">
          今日 · {formatShortDate(toDateKey())}
        </span>
        <Button variant="glass" size="md" onClick={() => navigate('/timeline')}>
          时间轴
        </Button>
      </div>

      {/* 2D 占位花园舞台 */}
      <GardenPlaceholder emotions={emotions} />

      {/* 左下 AI 反馈卡 */}
      {todayRecord?.aiAnalysis && (
        <div className="absolute bottom-28 left-5 z-20 w-[min(320px,calc(100%-2.5rem))]">
          <AiAnalysisCard analysis={todayRecord.aiAnalysis} accentColor={accent} />
        </div>
      )}

      {/* 底部陪伴语 */}
      <div className="absolute inset-x-0 bottom-20 z-20 px-5">
        {quote && <CompanionQuote text={quote} loading={companionLoading} onRefresh={refresh} />}
      </div>

      {/* 右下主行动 */}
      <div className="absolute bottom-6 right-5 z-20">
        <Button variant="glass" size="lg" onClick={() => navigate('/record')}>
          {todayRecord ? '查看今日' : '今天记录'}
        </Button>
      </div>
    </div>
  );
}
