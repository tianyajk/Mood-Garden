import { useRef, useState, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { useBackup, type ImportMode } from '@/hooks/useBackup';
import { duration, easing } from '@/config/theme';

/**
 * 数据备份折叠面板（导出 / 导入 / 二次确认）。
 * 默认折叠不打扰主界面；点击展开后才显示操作区。
 */
export function BackupPanel() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ImportMode>('merge');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    stats, exportNow, busy, preview, stagePreview, cancelPreview, confirmImport,
  } = useBackup();

  const onPickFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // 允许重复选同一个文件
    if (file) void stagePreview(file);
  };

  const incoming = preview?.backup.data;
  const incomingDate = preview?.backup.exportedAt
    ? new Date(preview.backup.exportedAt).toLocaleString('zh-CN', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : '未知时间';

  return (
    <>
      <div className="rounded-2xl bg-bg-sunken/60 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-caption text-ink-600 hover:text-ink-900 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span>💾</span>
            <span>数据备份</span>
            <span className="text-micro text-ink-400">
              {stats.moodCount} 条情绪 · {stats.meditationCount} 次冥想
            </span>
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: duration.base, ease: easing.soft }}
            className="text-ink-400"
          >
            ▾
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: duration.slow, ease: easing.gentle }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-3 px-4 pb-4">
                <p className="text-micro text-ink-400 leading-relaxed">
                  备份会保存你所有的情绪记录、冥想会话与自定义壁纸到本地 JSON 文件。
                  浏览器清缓存或换设备前建议导出一份。
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={exportNow}
                    className="flex-1 rounded-xl bg-white px-4 py-3 text-caption text-ink-900 shadow-sm hover:shadow transition-shadow"
                  >
                    导出备份
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={busy}
                    className="flex-1 rounded-xl bg-white px-4 py-3 text-caption text-ink-900 shadow-sm hover:shadow transition-shadow disabled:opacity-40"
                  >
                    {busy ? '解析中…' : '导入备份'}
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json,.json"
                  onChange={onPickFile}
                  className="hidden"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal open={!!preview} onClose={cancelPreview} label="确认导入备份">
        {preview && incoming && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="font-display text-h3 text-ink-900">确认导入备份</h3>
              <p className="mt-1 text-micro text-ink-400">{preview.fileName} · {incomingDate}</p>
            </div>

            <div className="rounded-xl bg-bg-sunken px-4 py-3 text-caption text-ink-600">
              备份包含
              <span className="mx-1 text-ink-900">{incoming.moodRecords.length}</span>
              条情绪记录、
              <span className="mx-1 text-ink-900">{incoming.meditationRecords.length}</span>
              次冥想
              {incoming.wallpaper ? '，含自定义壁纸。' : '。'}
            </div>

            <div className="flex flex-col gap-2">
              <ModeOption
                value="merge"
                current={mode}
                onChange={setMode}
                title="合并（推荐）"
                desc="保留你现有的数据，只新增备份里没有的；同 id 取较新的一条。"
              />
              <ModeOption
                value="replace"
                current={mode}
                onChange={setMode}
                title="替换"
                desc="清空当前所有情绪/冥想/壁纸，完全以备份为准。不可撤销。"
                danger
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={cancelPreview}
                className="flex-1 rounded-xl bg-bg-sunken px-4 py-3 text-caption text-ink-600 hover:bg-line-soft transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => confirmImport(mode)}
                className="flex-1 rounded-xl px-4 py-3 text-caption text-white transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: mode === 'replace' ? '#C97A6A' : '#7FB89B',
                }}
              >
                {mode === 'merge' ? '合并导入' : '替换导入'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

interface ModeOptionProps {
  value: ImportMode;
  current: ImportMode;
  onChange: (v: ImportMode) => void;
  title: string;
  desc: string;
  danger?: boolean;
}

function ModeOption({ value, current, onChange, title, desc, danger }: ModeOptionProps) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`text-left rounded-xl border px-4 py-3 transition-colors ${
        active
          ? danger
            ? 'border-[#C97A6A] bg-[#C97A6A]/5'
            : 'border-[#7FB89B] bg-[#7FB89B]/5'
          : 'border-line-soft bg-white hover:border-ink-400/40'
      }`}
    >
      <div className="flex items-center gap-2 text-caption text-ink-900">
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
            active
              ? danger
                ? 'border-[#C97A6A]'
                : 'border-[#7FB89B]'
              : 'border-ink-400/40'
          }`}
        >
          {active && (
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: danger ? '#C97A6A' : '#7FB89B' }}
            />
          )}
        </span>
        {title}
      </div>
      <p className="mt-1 pl-6 text-micro text-ink-400 leading-relaxed">{desc}</p>
    </button>
  );
}
