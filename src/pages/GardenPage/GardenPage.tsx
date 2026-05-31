import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { MoodRecord } from '@/types/mood';
import { Button } from '@/components/ui/Button';
import { MusicToggle } from '@/components/ui/MusicToggle';
import { useToast } from '@/components/ui/Toast';
import { AiAnalysisCard } from '@/components/feedback/AiAnalysisCard';
import { CompanionQuote } from '@/components/feedback/CompanionQuote';
import { RecordDetailModal } from '@/components/timeline/RecordDetailModal';
import { EmptyGarden } from '@/pages/GardenPage/EmptyGarden';
import { GardenCanvas } from '@/garden/GardenCanvas';
import { useMoodRecords } from '@/hooks/useMoodRecords';
import { useAiFeedback } from '@/hooks/useAiFeedback';
import { getEmotionConfig } from '@/config/emotions';
import { formatShortDate, toDateKey } from '@/utils/date';

/**
 * 花园展示页：挂载 3D 花园引擎 + AI 反馈 + 陪伴语（页面只组合）。
 * 3D 渲染逻辑在 garden/ 引擎与 useGardenScene，本页只做布局与状态编排。
 */
export function GardenPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const focusDate = (location.state as { focusDate?: string } | null)?.focusDate ?? null;

  const { notify } = useToast();
  const { records, todayRecord, hydrated, getRecordByDate } = useMoodRecords();
  const { fetchCompanion, companionLoading, degraded } = useAiFeedback();
  const [quote, setQuote] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);

  const source = todayRecord ?? records[0];
  const emotions = source?.emotions ?? [];
  const accent = emotions[0] ? getEmotionConfig(emotions[0]).color : undefined;
  const selectedRecord = useMemo<MoodRecord | null>(
    () => records.find((r) => r.id === selectedId) ?? null,
    [records, selectedId],
  );

  // 进入时按情绪生成陪伴语
  useEffect(() => {
    let alive = true;
    fetchCompanion(emotions).then((c) => {
      if (alive) setQuote(c.text);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source?.id]);

  // 时间轴「在花园中查看」：聚焦该株并弹出当天
  useEffect(() => {
    if (!focusDate) return;
    const rec = getRecordByDate(focusDate);
    if (rec) {
      setFocusId(rec.id);
      setSelectedId(rec.id);
    }
  }, [focusDate, getRecordByDate]);

  // AI 降级提示（无 key / 失败时）
  useEffect(() => {
    if (degraded) notify('AI 暂时打了个盹，先用了默认陪伴语', 'warning');
  }, [degraded, notify]);

  const refresh = () => fetchCompanion(emotions).then((c) => setQuote(c.text));

  // 空花园：已 hydrate 且无任何记录
  if (hydrated && records.length === 0) {
    return <EmptyGarden onSeed={() => navigate('/record')} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-sky-day">
      <GardenCanvas onPlantSelect={setSelectedId} focusRecordId={focusId} />

      {/* 顶部浮条 */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4">
        <span className="glass rounded-full px-4 py-1.5 text-caption text-ink-900">
          今日 · {formatShortDate(toDateKey())}
        </span>
        <Button variant="glass" size="md" onClick={() => navigate('/timeline')}>
          时间轴
        </Button>
      </div>

      {/* AI 反馈卡：桌面左下悬浮，移动端底部抽屉式 */}
      {todayRecord?.aiAnalysis && (
        <div className="absolute bottom-24 left-3 right-3 z-20 sm:bottom-28 sm:left-5 sm:right-auto sm:w-80">
          <AiAnalysisCard analysis={todayRecord.aiAnalysis} accentColor={accent} />
        </div>
      )}

      {/* 底部陪伴语 */}
      <div className="absolute inset-x-0 bottom-20 z-20 px-5">
        {quote && <CompanionQuote text={quote} loading={companionLoading} onRefresh={refresh} />}
      </div>

      {/* 左下音乐开关 */}
      <div className="absolute bottom-6 left-5 z-20">
        <MusicToggle />
      </div>

      {/* 右下主行动 */}
      <div className="absolute bottom-6 right-5 z-20">
        <Button variant="glass" size="lg" onClick={() => navigate('/record')}>
          {todayRecord ? '查看今日' : '今天记录'}
        </Button>
      </div>

      <RecordDetailModal
        record={selectedRecord}
        onClose={() => setSelectedId(null)}
        onViewInGarden={(r) => {
          setFocusId(r.id);
          setSelectedId(null);
        }}
      />
    </div>
  );
}
