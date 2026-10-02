import React from 'react';
import { WorkspaceWithAvailability } from '../../types/workspace';
import { CheckCircle2, Monitor, Users, XCircle } from 'lucide-react';

interface WorkspaceTooltipProps {
  workspace: WorkspaceWithAvailability | null;
  position: { x: number; y: number } | null;
}

export const WorkspaceTooltip: React.FC<WorkspaceTooltipProps> = ({
  workspace,
  position,
}) => {
  if (!workspace || !position) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 bg-popover/95 backdrop-blur border border-border text-popover-foreground px-3 py-2 rounded-xl shadow-lg text-xs space-y-1"
      style={{ left: `${position.x}px`, top: `${position.y - 12}px` }}
    >
      <div className="flex items-center space-x-2 font-semibold">
        <span>{workspace.name}</span>
        <span
          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
            workspace.isAvailable
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-slate-500/10 text-slate-500'
          }`}
        >
          {workspace.isAvailable ? (
            <>
              <CheckCircle2 className="w-3 h-3 mr-1" /> Свободно
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3 mr-1" /> Занято
            </>
          )}
        </span>
      </div>

      <div className="flex items-center space-x-3 text-[11px] text-muted-foreground">
        <span className="flex items-center space-x-1">
          <Users className="w-3 h-3" />
          <span>{workspace.capacity} {workspace.capacity === 1 ? 'место' : 'мест'}</span>
        </span>
        <span className="flex items-center space-x-1">
          <Monitor className="w-3 h-3" />
          <span>{workspace.type === 'MEETING_ROOM' ? 'Экран и ТВ' : 'Рабочее место'}</span>
        </span>
      </div>
    </div>
  );
};
