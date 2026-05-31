import type { MoodRecord } from '@/types/mood';
import { PhotoCard } from './PhotoCard';

interface AlbumMasonryProps {
  records: MoodRecord[];
  onClick: (record: MoodRecord) => void;
}

export function AlbumMasonry({ records, onClick }: AlbumMasonryProps) {
  const withImages = records.filter((r) => r.image);

  if (withImages.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="text-4xl">📷</span>
        <p className="text-body text-ink-400">还没有照片记录</p>
      </div>
    );
  }

  return (
    <div className="columns-2 gap-3">
      {withImages.map((r) => (
        <PhotoCard key={r.id} record={r} onClick={onClick} variant="masonry" />
      ))}
    </div>
  );
}
