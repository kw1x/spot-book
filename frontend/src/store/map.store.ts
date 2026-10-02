import { create } from 'zustand';
import { WorkspaceWithAvailability } from '../types/workspace';
import { addHours, format, setMinutes, setSeconds, setMilliseconds } from 'date-fns';

interface MapState {
  floor: number;
  selectedWorkspace: WorkspaceWithAvailability | null;
  fromTime: string;
  toTime: string;
  typeFilter: 'ALL' | 'DESK' | 'MEETING_ROOM';
  onlyAvailable: boolean;

  setFloor: (floor: number) => void;
  setSelectedWorkspace: (workspace: WorkspaceWithAvailability | null) => void;
  setTimeRange: (from: string, to: string) => void;
  setTypeFilter: (filter: 'ALL' | 'DESK' | 'MEETING_ROOM') => void;
  setOnlyAvailable: (onlyAvailable: boolean) => void;
  resetSelection: () => void;
}

const getDefaultTimeRange = () => {
  const now = new Date();
  const nextHour = addHours(setMilliseconds(setSeconds(setMinutes(now, 0), 0), 0), 1);
  const endSlot = addHours(nextHour, 2);

  return {
    from: format(nextHour, "yyyy-MM-dd'T'HH:mm:ss"),
    to: format(endSlot, "yyyy-MM-dd'T'HH:mm:ss"),
  };
};

const initialTimes = getDefaultTimeRange();

export const useMapStore = create<MapState>((set) => ({
  floor: 1,
  selectedWorkspace: null,
  fromTime: initialTimes.from,
  toTime: initialTimes.to,
  typeFilter: 'ALL',
  onlyAvailable: false,

  setFloor: (floor) => set({ floor, selectedWorkspace: null }),
  setSelectedWorkspace: (workspace) => set({ selectedWorkspace: workspace }),
  setTimeRange: (fromTime, toTime) => set({ fromTime, toTime }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setOnlyAvailable: (onlyAvailable) => set({ onlyAvailable }),
  resetSelection: () => set({ selectedWorkspace: null }),
}));
