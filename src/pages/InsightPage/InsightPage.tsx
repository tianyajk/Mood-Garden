import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { InsightPortraitCard } from '@/components/insight/InsightPortraitCard';
import { InsightPatternsCard } from '@/components/insight/InsightPatternsCard';
import { InsightSuggestionsCard } from '@/components/insight/InsightSuggestionsCard';
import { InsightPeriodCard } from '@/components/insight/InsightPeriodCard';
import { BackupPanel } from '@/components/settings/BackupPanel';
import { useAiInsight } from '@/hooks/useAiInsight';
import { useInsightPeriods } from '@/hooks/useInsightPeriods';
import { useMoodRecords } from '@/hooks/useMoodRecords';
import { duration, easing } from '@/config/theme';

const TABS = [
  { key: 'week' as const,  label: '近 7 天' },
  { key: 'month' as const, label: '近 30 天' },
  { key: 'all' as const,   label: '全部时间' },
];

export function InsightPage() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { records } = useMoodRecords();
  const { insight, loading, degraded, generate, hasEnoughData, isStale, minRecords, recordCount } =
    useAiInsight();
  const { tab, setTab, weekRecords, monthRecords } = useInsightPeriods(records);

  const fadeIn = (delay = 0) => ({
    initial: reduce ? { opacity: 1 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration.slow, ease: easing.gentle, delay },
  });

  const generatedDate = insight
    ? new Date(insight.generatedAt).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="mx-auto max-w-[480px] px-5 py-8">

        <motion.header className="flex items-center justify-between mb-8" {...fadeIn()}>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 rounded-xl bg-bg-sunken px-3 py-2 text-caption text-ink-600 hover:bg-line-soft hover:text-ink-900 transition-colors"
          >
            ← 返回
          </button>
          <h1 className="font-display text-h2 text-ink-900">AI 洞察</h1>
          <button
            onClick={() => void generate()}
            disabled={!hasEnoughData || loading}
            className="rounded-xl bg-bg-sunken px-3 py-2 text-caption text-ink-600 hover:bg-line-soft transition-colors disabled:opacity-40"
          >
            {loading ? '分析中…' : '重新分析'}
          </button>
        </motion.header>

        <motion.div className="mb-6" {...fadeIn(0.05)}>
          <BackupPanel />
        </motion.div>

        {/* 数据不足 */}
        {!hasEnoughData && (
          <motion.div className="flex flex-col items-center gap-4 py-24 text-center" {...fadeIn(0.1)}>
            <span className="text-5xl">🌱</span>
            <p className="text-body text-ink-900">
              再记录 <span className="font-medium">{minRecords - recordCount}</span> 条情绪
            </p>
            <p className="text-caption text-ink-400">积累足够的记录后，AI 就能为你描绘专属情绪画像</p>
            <button
              onClick={() => navigate('/record')}
              className="mt-2 rounded-xl px-6 py-3 text-caption text-white transition-colors"
              style={{ backgroundColor: '#7FB89B' }}
            >
              去记录今天的情绪
            </button>
          </motion.div>
        )}

        {/* 首次加载中 */}
        {hasEnoughData && loading && !insight && (
          <motion.div className="flex flex-col items-center gap-4 py-24 text-center" {...fadeIn(0.1)}>
            <motion.div
              className="text-4xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✨
            </motion.div>
            <p className="text-body text-ink-600">正在分析你的情绪世界…</p>
            <p className="text-caption text-ink-400">基于 {recordCount} 条记录</p>
          </motion.div>
        )}

        {/* 洞察内容 */}
        {insight && (
          <div className="flex flex-col gap-5">

            {/* Tab 切换 */}
            <motion.div
              className="flex gap-1 rounded-2xl bg-bg-sunken p-1"
              {...fadeIn(0.05)}
            >
              {TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex-1 rounded-xl py-2 text-caption transition-colors ${
                    tab === key
                      ? 'bg-white text-ink-900 shadow-sm'
                      : 'text-ink-400 hover:text-ink-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              {tab === 'week' && (
                <motion.div
                  key="week"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <InsightPeriodCard label="近 7 天" periodSummary={insight.week} records={weekRecords} />
                </motion.div>
              )}

              {tab === 'month' && (
                <motion.div
                  key="month"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <InsightPeriodCard label="近 30 天" periodSummary={insight.month} records={monthRecords} />
                </motion.div>
              )}

              {tab === 'all' && (
                <motion.div
                  key="all"
                  className="flex flex-col gap-5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <InsightPortraitCard insight={insight} records={records} />
                  <InsightPatternsCard patterns={insight.patterns} />
                  <InsightSuggestionsCard suggestions={insight.suggestions} />
                  <div className="py-6 text-center">
                    <p className="font-display text-body-lg italic text-ink-600 leading-relaxed">
                      {insight.encouragement}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 底部元信息 */}
            <motion.div
              className="flex items-center justify-between text-micro text-ink-400 pb-4"
              {...fadeIn(0.3)}
            >
              <span>{generatedDate} 生成 · {insight.recordCount} 条记录</span>
              <div className="flex items-center gap-3">
                {degraded && <span>本地分析</span>}
                {isStale && !loading && (
                  <button
                    onClick={() => void generate()}
                    className="hover:text-ink-600 transition-colors"
                  >
                    数据已更新，重新分析 →
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}

        <div className="h-8" />
      </div>
    </div>
  );
}
