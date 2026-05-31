import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import type { MoodRecord } from '@/types/mood';
import type { GardenStage } from '@/types/garden';
import { deriveStage } from '@/config/growth';
import { loadRecords, saveRecords } from '@/services/storage/moodStorage';

/**
 * 全局状态：唯一真相源（架构设计第四节）。
 * records 为持久化真相；stage 为派生值（随 records 重算，不单独存储）。
 */
export interface GardenState {
  records: MoodRecord[];
  stage: GardenStage; // 派生：当前成长阶段
  hydrated: boolean; // 是否已从 LocalStorage 加载
}

export type GardenAction =
  | { type: 'HYDRATE'; payload: MoodRecord[] }
  | { type: 'ADD_RECORD'; payload: MoodRecord }
  | { type: 'UPDATE_RECORD'; payload: MoodRecord };

const initialState: GardenState = {
  records: [],
  stage: 'seed',
  hydrated: false,
};

/** 由记录列表派生 stage（按不重复日期计数） */
function withDerived(records: MoodRecord[], hydrated: boolean): GardenState {
  const uniqueDays = new Set(records.map((r) => r.date)).size;
  return {
    records,
    stage: deriveStage(uniqueDays).stage,
    hydrated,
  };
}

function reducer(state: GardenState, action: GardenAction): GardenState {
  switch (action.type) {
    case 'HYDRATE':
      return withDerived(action.payload, true);
    case 'ADD_RECORD':
      return withDerived([...state.records, action.payload], state.hydrated);
    case 'UPDATE_RECORD':
      return withDerived(
        state.records.map((r) => (r.id === action.payload.id ? action.payload : r)),
        state.hydrated,
      );
    default:
      return state;
  }
}

interface GardenContextValue {
  state: GardenState;
  dispatch: React.Dispatch<GardenAction>;
}

const GardenContext = createContext<GardenContextValue | null>(null);

export function GardenProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 启动 hydrate
  useEffect(() => {
    dispatch({ type: 'HYDRATE', payload: loadRecords() });
  }, []);

  // records 变更同步持久化（hydrate 之前不写，避免覆盖已存数据）
  useEffect(() => {
    if (state.hydrated) {
      saveRecords(state.records);
    }
  }, [state.records, state.hydrated]);

  return <GardenContext.Provider value={{ state, dispatch }}>{children}</GardenContext.Provider>;
}

/** 内部消费入口；hooks 层在其上封装业务语义 */
export function useGardenContext(): GardenContextValue {
  const ctx = useContext(GardenContext);
  if (!ctx) {
    throw new Error('useGardenContext 必须在 <GardenProvider> 内使用');
  }
  return ctx;
}
