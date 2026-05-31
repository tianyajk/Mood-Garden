import { useEffect, useState } from 'react';

const STORAGE_KEY = 'mood_garden_wallpaper';

function loadWallpaper(): string | null {
  try { return localStorage.getItem(STORAGE_KEY); }
  catch { return null; }
}

export function WallpaperLayer() {
  const [src, setSrc] = useState<string | null>(loadWallpaper);

  useEffect(() => {
    const update = () => setSrc(loadWallpaper());
    window.addEventListener('wallpaper-changed', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('wallpaper-changed', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  useEffect(() => {
    if (src) {
      document.documentElement.setAttribute('data-wallpaper', '');
    } else {
      document.documentElement.removeAttribute('data-wallpaper');
    }
    return () => document.documentElement.removeAttribute('data-wallpaper');
  }, [src]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}
