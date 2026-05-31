import { useRef, useState } from 'react';

/**
 * 极简圆形音乐开关，默认静音待用户开启（避免突兀）。
 * 音频文件缺失时 play() 失败被静默捕获，不影响其他功能。
 */
export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/ambient.mp3" loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? '关闭背景音乐' : '开启背景音乐'}
        aria-pressed={playing}
        className="glass flex h-11 w-11 items-center justify-center rounded-full text-ink-900 transition-shadow hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
      >
        {playing ? '♪' : '🔇'}
      </button>
    </>
  );
}
