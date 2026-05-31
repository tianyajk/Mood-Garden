import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { TimerDial } from '@/components/meditation/TimerDial';
import { DurationPicker } from '@/components/meditation/DurationPicker';
import { SoundPicker } from '@/components/meditation/SoundPicker';
import { MeditationStats } from '@/components/meditation/MeditationStats';
import { SessionComplete } from '@/components/meditation/SessionComplete';
import { useMeditationSession } from '@/hooks/useMeditationSession';

/** 冥想页：呼吸计时 + 音景 + 统计（页面只布局，逻辑在 useMeditationSession） */
export function MeditatePage() {
  const navigate = useNavigate();
  const { timer, sound, stats, completion, controls } = useMeditationSession();
  const idle = timer.phase === 'idle';

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-sky-day px-6 py-8">
      <div className="absolute inset-0 bg-white/5" />

      <header className="relative z-10 flex w-full max-w-[460px] items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="glass flex h-10 w-10 items-center justify-center rounded-full text-white"
          aria-label="返回首页"
        >
          ←
        </button>
        <h1 className="font-display text-h3 text-white">静心一刻</h1>
        <div className="h-10 w-10" />
      </header>

      <main className="relative z-10 mt-6 flex w-full flex-1 flex-col items-center justify-center gap-8">
        <MeditationStats stats={stats} />

        <TimerDial remainingSec={timer.remainingSec} progress={timer.progress} phase={timer.phase} />

        {idle && (
          <div className="flex flex-col items-center gap-5">
            <DurationPicker value={timer.plannedSec} onChange={timer.changeDuration} disabled={!idle} />
            <SoundPicker
              value={sound.ambient}
              playing={sound.playing}
              volume={sound.volume}
              onSelect={sound.selectAmbient}
              onVolumeChange={sound.setVolume}
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          {idle && (
            <Button variant="glass" size="lg" onClick={controls.start}>
              开始冥想
            </Button>
          )}
          {timer.phase === 'running' && (
            <>
              <Button variant="glass" onClick={controls.pause}>暂停</Button>
              <Button variant="primary" onClick={controls.finishEarly}>结束</Button>
            </>
          )}
          {timer.phase === 'paused' && (
            <>
              <Button variant="glass" onClick={controls.resume}>继续</Button>
              <Button variant="primary" onClick={controls.finishEarly}>结束</Button>
            </>
          )}
        </div>
      </main>

      {/* 完成卡浮层 */}
      <AnimatePresence>
        {completion && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-ink-900/30 px-6 backdrop-blur-sm">
            <SessionComplete
              minutes={completion.minutes}
              completed={completion.completed}
              onAgain={controls.again}
              onClose={controls.closeCompletion}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
