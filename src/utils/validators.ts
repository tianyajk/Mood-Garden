import type { MoodDraft } from '@/types/mood';

/** 描述字数上限（需求文档 功能2） */
export const DESCRIPTION_MAX = 300;

export interface ValidationResult {
  valid: boolean;
  message: string | null;
}

/** 校验记录草稿：至少选一种情绪，描述不超限 */
export function validateDraft(draft: MoodDraft): ValidationResult {
  if (draft.emotions.length === 0) {
    return { valid: false, message: '先选择此刻的情绪吧' };
  }
  if (draft.description.length > DESCRIPTION_MAX) {
    return { valid: false, message: `描述请控制在 ${DESCRIPTION_MAX} 字以内` };
  }
  return { valid: true, message: null };
}

/** 截断描述到上限（输入兜底） */
export function clampDescription(text: string): string {
  return text.length > DESCRIPTION_MAX ? text.slice(0, DESCRIPTION_MAX) : text;
}
