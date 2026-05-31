import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TimerDial } from '@/components/meditation/TimerDial';
import { DurationPicker } from '@/components/meditation/DurationPicker';
import { SoundPicker } from '@/components/meditation/SoundPicker';
import { MeditationStats } from '@/components/meditation/MeditationStats';
import { SessionComplete } from '@/components/meditation/SessionComplete';
import { useMeditationSession } from '@/hooks/useMeditationSession';
import { useMoodRecords } from '@/hooks/useMoodRecords';
import { getEmotionConfig } from '@/config/emotions';
import { duration, easing } from '@/config/theme';

export function MeditatePage() {
  const navigate = useNavigate();
  const { timer, sound, stats, completion, controls } = useMeditationSession();
  const { latestTodayRecord: todayRecord } = useMoodRecords();
  const idle = timer.phase === 'idle';
  const appliedRef = useRef(false);

  useEffect(() => {
    if (!idle || appliedRef.current) return;
    const first = todayRecord?.emotions[0];
    if (!first) return;
    const recommended = getEmotionConfig(first).recommendedAmbient;
    if (recommended) {
      sound.selectAmbient(recommended);
      appliedRef.current = true;
    }
  }, [idle, todayRecord, sound]);

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#3A3530]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#3A3530] via-[#3A3530] to-[#2D2824]" />

      {/* Header */}
      <header className="relative z-10 flex w-full max-w-[480px] items-center justify-between px-6 pt-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 rounded-xl bg-white/10 px-3 py-2 text-caption text-white/70 hover:bg-white/15 hover:text-white transition-colors"
          aria-label="返回首页"
        >
          ← 返回
        </button>
        <h1 className="font-display text-h3 text-white/90">静心一刻</h1>
        <div className="h-10 w-10" />
      </header>

      <main className="relative z-10 mt-8 flex w-full flex-1 flex-col items-center justify-center gap-10 px-6">
        <MeditationStats stats={stats} />

        <TimerDial remainingSec={timer.remainingSec} progress={timer.progress} phase={timer.phase} />

        {idle && (
          <motion.div
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: easing.gentle }}
          >
            <DurationPicker value={timer.plannedSec} onChange={timer.changeDuration} disabled={!idle} />
            <SoundPicker
              value={sound.ambient}
              playing={sound.playing}
              volume={sound.volume}
              onSelect={sound.selectAmbient}
              onVolumeChange={sound.setVolume}
            />
          </motion.div>
        )}

        <div className="flex items-center gap-3">
          {idle && (
            <button
              onClick={controls.start}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white text-xl hover:bg-white/25 transition-colors"
              aria-label="开始冥想"
            >
              ▶
            </button>
          )}
          {timer.phase === 'running' && (
            <div className="flex items-center gap-4">
              <button
                onClick={controls.pause}
                className="text-white/60 hover:text-white/90 transition-colors text-caption"
              >
                暂停
              </button>
              <button
                onClick={controls.finishEarly}
                className="text-white/40 hover:text-white/70 transition-colors text-caption"
              >
                结束
              </button>
            </div>
          )}
          {timer.phase === 'paused' && (
            <div className="flex items-center gap-4">
              <button
                onClick={controls.resume}
                className="text-white/60 hover:text-white/90 transition-colors text-caption"
              >
                继续
              </button>
              <button
                onClick={controls.finishEarly}
                className="text-white/40 hover:text-white/70 transition-colors text-caption"
              >
                结束
              </button>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {completion && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center bg-[#2D2824]/80 px-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SessionComplete
              minutes={completion.minutes}
              completed={completion.completed}
              onAgain={controls.again}
              onClose={controls.closeCompletion}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
