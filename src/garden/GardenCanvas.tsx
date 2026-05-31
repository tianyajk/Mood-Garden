import type { PlantSelectHandler } from '@/garden/core/SceneManager';
import { GardenPlaceholder } from '@/pages/GardenPage/GardenPlaceholder';
import { Loading } from '@/components/ui/Loading';
import { useGardenScene } from '@/hooks/useGardenScene';
import { useMoodRecords } from '@/hooks/useMoodRecords';

interface GardenCanvasProps {
  onPlantSelect: PlantSelectHandler;
  focusRecordId?: string | null;
}

/**
 * 花园引擎的 React 容器：仅负责挂载 DOM 与生命周期，渲染交给引擎。
 * 资源加载中显示生长占位；WebGL 不可用时降级为 2D 占位（复用 GardenPlaceholder）。
 */
export function GardenCanvas({ onPlantSelect, focusRecordId }: GardenCanvasProps) {
  const { containerRef, supported, ready } = useGardenScene({ onPlantSelect, focusRecordId });
  const { todayRecord } = useMoodRecords();

  if (!supported) {
    return <GardenPlaceholder emotions={todayRecord?.emotions ?? []} />;
  }

  return (
    <>
      <div ref={containerRef} className="absolute inset-0 z-0" />
      {!ready && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Loading />
        </div>
      )}
    </>
  );
}
