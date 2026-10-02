import React, { useState } from 'react';
import { WorkspaceWithAvailability } from '../../types/workspace';
import { FloorBackground } from './FloorBackground';
import { WorkspaceNode } from './WorkspaceNode';
import { WorkspaceTooltip } from './WorkspaceTooltip';
import { useMapStore } from '../../store/map.store';
import { Minus, Plus, RotateCcw } from 'lucide-react';

interface FloorMapProps {
  workspaces: WorkspaceWithAvailability[];
}

export const FloorMap: React.FC<FloorMapProps> = ({ workspaces }) => {
  const {
    selectedWorkspace,
    setSelectedWorkspace,
    typeFilter,
    onlyAvailable,
    resetSelection,
  } = useMapStore();

  const [zoom, setZoom] = useState<number>(1);
  const [hoveredWorkspace, setHoveredWorkspace] = useState<WorkspaceWithAvailability | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const filteredWorkspaces = workspaces.filter((ws) => {
    if (typeFilter !== 'ALL' && ws.type !== typeFilter) return false;
    if (onlyAvailable && !ws.isAvailable) return false;
    return true;
  });

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.7));
  const handleResetZoom = () => setZoom(1);

  const handleHover = (ws: WorkspaceWithAvailability | null, e?: React.MouseEvent) => {
    setHoveredWorkspace(ws);
    if (ws && e) {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    } else {
      setTooltipPos(null);
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-1.5 bg-card/90 backdrop-blur border border-border p-1.5 rounded-xl shadow-sm">
        <button
          onClick={handleZoomIn}
          title="Приблизить"
          className="p-1.5 rounded-lg hover:bg-muted text-foreground transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Отдалить"
          className="p-1.5 rounded-lg hover:bg-muted text-foreground transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          title="Сбросить масштаб"
          className="p-1.5 rounded-lg hover:bg-muted text-foreground transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="text-[11px] font-mono px-2 text-muted-foreground border-l border-border">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      <div
        className="w-full overflow-auto max-h-[740px] p-6 flex items-center justify-center cursor-default"
        onClick={() => resetSelection()}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out',
            width: '100%',
            maxWidth: '1100px',
          }}
        >
          <svg
            viewBox="0 -35 1000 740"
            className="w-full h-auto drop-shadow-sm transition-all"
            style={{ minWidth: '700px' }}
          >
            <FloorBackground />

            {filteredWorkspaces.map((workspace) => (
              <WorkspaceNode
                key={workspace.id}
                workspace={workspace}
                isSelected={selectedWorkspace?.id === workspace.id}
                onSelect={(ws) => setSelectedWorkspace(ws)}
                onHover={handleHover}
              />
            ))}
          </svg>
        </div>
      </div>

      <WorkspaceTooltip workspace={hoveredWorkspace} position={tooltipPos} />
    </div>
  );
};
