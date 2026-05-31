interface MoodTextInputProps {
  value: string;
  charCount: number;
  charMax: number;
  onChange: (text: string) => void;
}

/** 描述输入 + 字数计数（受控，截断逻辑在 useMoodForm） */
export function MoodTextInput({ value, charCount, charMax, onChange }: MoodTextInputProps) {
  return (
    <div className="rounded-md border border-line-soft bg-bg-sunken p-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="今天发生了什么？例：今天面试结束了，感觉有点紧张。"
        rows={4}
        maxLength={charMax}
        className="w-full resize-none bg-transparent text-body text-ink-900 placeholder:text-ink-400 focus:outline-none"
        aria-label="情绪描述"
      />
      <div className="mt-1 text-right text-micro text-ink-400">
        {charCount} / {charMax}
      </div>
    </div>
  );
}
