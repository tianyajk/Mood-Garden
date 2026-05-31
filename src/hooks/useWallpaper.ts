import { useCallback, useState } from 'react';

const STORAGE_KEY = 'mood_garden_wallpaper';
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 0.65;

function load(): string | null {
  try { return localStorage.getItem(STORAGE_KEY); }
  catch { return null; }
}

function save(base64: string | null): boolean {
  try {
    if (base64) localStorage.setItem(STORAGE_KEY, base64);
    else localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('wallpaper-changed'));
    return true;
  } catch {
    return false;
  }
}

/** 压缩图片到合理尺寸后再转 base64 */
export function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const w = img.width;
      const h = img.height;
      const scale = Math.min(1, MAX_WIDTH / Math.max(w, h));
      const cw = Math.round(w * scale);
      const ch = Math.round(h * scale);
      const canvas = document.createElement('canvas');
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas unavailable')); return; }
      ctx.drawImage(img, 0, 0, cw, ch);
      resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

export function useWallpaper() {
  const [wallpaper, setWallpaper] = useState<string | null>(load);

  const set = useCallback((base64: string | null) => {
    if (!save(base64)) return false;
    setWallpaper(base64);
    return true;
  }, []);

  const remove = useCallback(() => {
    save(null);
    setWallpaper(null);
  }, []);

  return { wallpaper, set, remove };
}
