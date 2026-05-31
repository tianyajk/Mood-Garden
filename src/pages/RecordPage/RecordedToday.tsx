import { useNavigate } from 'react-router-dom';
import type { MoodRecord } from '@/types/mood';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getEmotionConfig } from '@/config/emotions';

interface RecordedTodayProps {
  record: MoodRecord;
  onEdit: () => void;
}

/** 状态 C：今日已记录（低保真原型 二·状态C） */
export function RecordedToday({ record, onEdit }: RecordedTodayProps) {
  const navigate = useNavigate();
  const labels = record.emotions.map((e) => getEmotionConfig(e).label).join('、');

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <Card className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <span className="text-4xl">🌼</span>
        <h2 className="text-h3 text-ink-900">今天你已经记录过了</h2>
        <p className="text-body text-ink-600">「{labels}」</p>
        <div className="mt-2 flex gap-3">
          <Button variant="secondary" onClick={onEdit}>
            修改今天
          </Button>
          <Button onClick={() => navigate('/garden')}>去花园看看 →</Button>
        </div>
      </Card>
    </div>
  );
}
