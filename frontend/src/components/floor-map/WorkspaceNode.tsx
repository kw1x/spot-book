import React from 'react';
import { WorkspaceWithAvailability } from '../../types/workspace';

interface WorkspaceNodeProps {
  workspace: WorkspaceWithAvailability;
  isSelected: boolean;
  onSelect: (workspace: WorkspaceWithAvailability) => void;
  onHover: (workspace: WorkspaceWithAvailability | null, e?: React.MouseEvent) => void;
}

export const WorkspaceNode: React.FC<WorkspaceNodeProps> = ({
  workspace,
  isSelected,
  onSelect,
  onHover,
}) => {
  const isMeetingRoom = workspace.type === 'MEETING_ROOM';
  const isAvailable = workspace.isAvailable;

  const getFillColor = () => {
    if (isSelected) {
      return 'fill-primary/20 stroke-primary';
    }
    if (!isAvailable) {
      return 'fill-slate-200/60 dark:fill-slate-800/60 stroke-slate-300 dark:stroke-slate-700';
    }
    if (isMeetingRoom) {
      return 'fill-sky-500/10 dark:fill-sky-500/15 stroke-sky-500/70 hover:fill-sky-500/20';
    }
    return 'fill-emerald-500/10 dark:fill-emerald-500/15 stroke-emerald-500/70 hover:fill-emerald-500/20';
  };

  const getStatusBadgeColor = () => {
    if (isSelected) return 'fill-primary';
    if (!isAvailable) return 'fill-slate-400 dark:fill-slate-600';
    return 'fill-emerald-500';
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(workspace);
  };

  return (
    <g
      className={`transition-all duration-150 cursor-pointer ${
        !isAvailable ? 'opacity-70 cursor-pointer' : ''
      }`}
      onClick={handleClick}
      onMouseEnter={(e) => onHover(workspace, e)}
      onMouseLeave={() => onHover(null)}
    >
      <rect
        x={workspace.posX}
        y={workspace.posY}
        width={workspace.width}
        height={workspace.height}
        rx={isMeetingRoom ? 10 : 6}
        className={`${getFillColor()} stroke-[1.5] transition-colors`}
        strokeDasharray={!isAvailable ? '4 2' : undefined}
      />

      {isSelected && (
        <rect
          x={workspace.posX - 3}
          y={workspace.posY - 3}
          width={workspace.width + 6}
          height={workspace.height + 6}
          rx={isMeetingRoom ? 13 : 9}
          fill="none"
          className="stroke-primary stroke-2 animate-pulse"
        />
      )}

      <circle
        cx={workspace.posX + 10}
        cy={workspace.posY + 10}
        r={3.5}
        className={getStatusBadgeColor()}
      />

      <text
        x={workspace.posX + (isMeetingRoom ? 20 : 18)}
        y={workspace.posY + 14}
        className="fill-foreground text-[10px] font-semibold tracking-tight pointer-events-none select-none"
      >
        {workspace.name}
      </text>

      {isMeetingRoom ? (
        <g className="pointer-events-none select-none">
          <text
            x={workspace.posX + 12}
            y={workspace.posY + 32}
            className="fill-muted-foreground text-[9px] font-medium"
          >
            Вместимость: {workspace.capacity} чел.
          </text>
          <text
            x={workspace.posX + 12}
            y={workspace.posY + 46}
            className={`text-[9px] font-semibold ${
              isAvailable ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-slate-400 dark:fill-slate-500'
            }`}
          >
            {isAvailable ? 'Свободна' : 'Занята'}
          </text>
        </g>
      ) : (
        <g className="pointer-events-none select-none">
          <text
            x={workspace.posX + 10}
            y={workspace.posY + workspace.height - 8}
            className={`text-[8.5px] font-medium ${
              isAvailable ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-slate-400 dark:fill-slate-500'
            }`}
          >
            {isAvailable ? 'Свободен' : 'Занят'}
          </text>
        </g>
      )}
    </g>
  );
};
