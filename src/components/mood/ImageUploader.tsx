import { useRef, useState } from 'react';

interface ImageUploaderProps {
  image: string | undefined;
  onChange: (base64: string | undefined) => void;
}

const MAX_SIZE_MB = 5;

export function ImageUploader({ image, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const handleFile = (file: File) => {
    setError('');
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`图片不能超过 ${MAX_SIZE_MB}MB`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (image) {
    return (
      <div className="relative group rounded-xl overflow-hidden border border-line-soft">
        <img src={image} alt="记录照片" className="w-full h-48 object-cover" />
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-ink-900/60 text-white text-xs flex items-center justify-center hover:bg-ink-900/80 transition-colors"
          aria-label="移除照片"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-xl border-2 border-dashed border-line-soft p-6 text-center hover:border-ink-400/30 transition-colors"
      >
        <span className="text-2xl mb-2 block">📷</span>
        <span className="text-caption text-ink-400">添加照片</span>
      </button>
      {error && <p className="mt-1 text-micro text-danger">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
