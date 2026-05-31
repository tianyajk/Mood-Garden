interface MoodTextInputProps {
  value: string;
  charCount: number;
  charMax: number;
  onChange: (text: string) => void;
}

export function MoodTextInput({ value, charCount, charMax, onChange }: MoodTextInputProps) {
  return (
    <div className="rounded-xl border border-line-soft bg-[#FFFDF7] p-5 shadow-sm">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="今天发生了什么？"
        rows={4}
        maxLength={charMax}
        className="w-full resize-none bg-transparent text-body text-ink-900 placeholder:text-ink-400 focus:outline-none"
        aria-label="情绪描述"
      />
      <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-3">
        <span className="text-micro text-ink-400">记录此刻的感受</span>
        <span className="text-micro text-ink-400 tabular-nums">
          {charCount}<span className="text-ink-400/50">/{charMax}</span>
        </span>
      </div>
    </div>
  );
}
