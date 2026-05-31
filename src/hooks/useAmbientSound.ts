import { useCallback, useEffect, useRef, useState } from 'react';
import type { AmbientKey } from '@/types/meditation';
import { DEFAULT_AMBIENT, getAmbient } from '@/config/meditation';

/**
 * 背景音景播放控制：选择 / 播放 / 暂停 / 音量。
 * 音频文件缺失或自动播放被拦截时静默降级（不报错、不阻断计时）。
 * 单例 <Audio>，切换音景即换 src；静默档不加载音频。
 */
export function useAmbientSound(initial: AmbientKey = DEFAULT_AMBIENT) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ambient, setAmbientState] = useState<AmbientKey>(initial);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.6);

  // 懒创建单例 audio
  const ensureAudio = useCallback((): HTMLAudioElement => {
    if (!audioRef.current) {
      const el = new Audio();
      el.loop = true;
      el.volume = volume;
      audioRef.current = el;
    }
    return audioRef.current;
  }, [volume]);

  // 卸载停止
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  /** 真正尝试播放当前 ambient（静默档直接置为未播放） */
  const playCurrent = useCallback(
    (key: AmbientKey) => {
      const option = getAmbient(key);
      const audio = ensureAudio();
      if (!option.src) {
        audio.pause();
        setPlaying(false);
        return;
      }
      if (!audio.src.endsWith(option.src)) {
        audio.src = option.src;
      }
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false)); // 文件缺失 / 自动播放拦截
    },
    [ensureAudio],
  );

  /** 切换音景；若正在播放则立即换源续播 */
  const selectAmbient = useCallback(
    (key: AmbientKey) => {
      setAmbientState(key);
      if (playing || getAmbient(key).src) {
        playCurrent(key);
      }
    },
    [playing, playCurrent],
  );

  /** 开关播放 */
  const toggle = useCallback(() => {
    const audio = ensureAudio();
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      playCurrent(ambient);
    }
  }, [playing, ambient, ensureAudio, playCurrent]);

  /** 显式停止（结束会话用） */
  const stop = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  /** 调音量 0–1 */
  const setVolume = useCallback((v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    setVolumeState(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }, []);

  return { ambient, playing, volume, selectAmbient, toggle, stop, setVolume };
}
