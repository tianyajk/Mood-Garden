import { useCallback, useState } from 'react';
import { useMeditationTimer } from '@/hooks/useMeditationTimer';
import { useAmbientSound } from '@/hooks/useAmbientSound';
import { useMeditationRecords } from '@/hooks/useMeditationRecords';
import { DEFAULT_DURATION_SEC } from '@/config/meditation';

/** 完成卡片展示态 */
interface CompletionView {
  minutes: number;
  completed: boolean;
}

/**
 * 冥想会话编排：把计时状态机、音景、记录统计三者组装成页面可直接消费的接口。
 * 页面只渲染，业务流程（自然结束/提前结束→落库→展示完成卡）全在此。
 */
export function useMeditationSession() {
  const sound = useAmbientSound();
  const records = useMeditationRecords();
  const [completion, setCompletion] = useState<CompletionView | null>(null);

  /** 自然走完：按设定时长落库 + 停音 + 弹完成卡 */
  const handleNaturalFinish = useCallback(
    (elapsedSec: number) => {
      sound.stop();
      records.addSession({
        plannedSec: timer.plannedSec,
        elapsedSec,
        completed: true,
        ambient: sound.ambient,
      });
      setCompletion({ minutes: Math.floor(elapsedSec / 60), completed: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [records, sound],
  );

  const timer = useMeditationTimer(DEFAULT_DURATION_SEC, { onFinish: handleNaturalFinish });

  /** 开始：启动计时（音景若选了非静默则一并播放） */
  const start = useCallback(() => {
    timer.start();
    if (sound.ambient !== 'silent') sound.selectAmbient(sound.ambient);
  }, [timer, sound]);

  /** 提前结束：有有效时长才落库，再停音、弹卡 */
  const finishEarly = useCallback(() => {
    const elapsed = Math.floor(timer.elapsedSec);
    sound.stop();
    if (elapsed > 0) {
      records.addSession({
        plannedSec: timer.plannedSec,
        elapsedSec: elapsed,
        completed: false,
        ambient: sound.ambient,
      });
    }
    timer.reset();
    setCompletion({ minutes: Math.floor(elapsed / 60), completed: false });
  }, [timer, sound, records]);

  /** 关闭完成卡，回到准备态 */
  const closeCompletion = useCallback(() => {
    timer.reset();
    setCompletion(null);
  }, [timer]);

  /** 再来一次：复用同一时长直接开始 */
  const again = useCallback(() => {
    setCompletion(null);
    timer.start();
    if (sound.ambient !== 'silent') sound.selectAmbient(sound.ambient);
  }, [timer, sound]);

  return {
    timer,
    sound,
    stats: records.stats,
    completion,
    controls: { start, pause: timer.pause, resume: timer.resume, finishEarly, again, closeCompletion },
  };
}
