import React from 'react';
import { useMapStore } from '../../store/map.store';
import { WorkspaceWithAvailability } from '../../types/workspace';
import { Calendar, Clock, Layers } from 'lucide-react';
import { format } from 'date-fns';

interface FilterBarProps {
  workspaces: WorkspaceWithAvailability[];
}

export const FilterBar: React.FC<FilterBarProps> = ({ workspaces }) => {
  const {
    floor,
    setFloor,
    fromTime,
    toTime,
    setTimeRange,
    typeFilter,
    setTypeFilter,
    onlyAvailable,
    setOnlyAvailable,
  } = useMapStore();

  const totalCount = workspaces.length;
  const availableCount = workspaces.filter((w) => w.isAvailable).length;
  const occupiedCount = totalCount - availableCount;

  const handleDateChange = (newDateStr: string) => {
    try {
      const fromHour = fromTime.substring(11);
      const toHour = toTime.substring(11);
      setTimeRange(`${newDateStr}T${fromHour}`, `${newDateStr}T${toHour}`);
    } catch {}
  };

  const handleStartTimeChange = (newStartHour: string) => {
    const datePart = fromTime.substring(0, 10);
    const toDatePart = toTime.substring(0, 10);
    const toHour = toTime.substring(11);

    const newFrom = `${datePart}T${newStartHour}:00`;
    let newTo = `${toDatePart}T${toHour}`;

    if (newTo <= newFrom) {
      const [h, m] = newStartHour.split(':').map(Number);
      const nextH = String(Math.min(h + 2, 23)).padStart(2, '0');
      newTo = `${toDatePart}T${nextH}:${String(m).padStart(2, '0')}:00`;
    }

    setTimeRange(newFrom, newTo);
  };

  const handleEndTimeChange = (newEndHour: string) => {
    const toDatePart = toTime.substring(0, 10);
    const newTo = `${toDatePart}T${newEndHour}:00`;
    setTimeRange(fromTime, newTo);
  };

  const currentDateVal = fromTime ? fromTime.substring(0, 10) : format(new Date(), 'yyyy-MM-dd');
  const currentStartVal = fromTime ? fromTime.substring(11, 16) : '09:00';
  const currentEndVal = toTime ? toTime.substring(11, 16) : '11:00';

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-muted/60 px-3 py-1.5 rounded-xl border border-border">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Этаж:</span>
            <select
              value={floor}
              onChange={(e) => setFloor(Number(e.target.value))}
              className="bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
            >
              <option value={1} className="bg-card">Этаж 1 (Опенспейс и переговорные)</option>
              <option value={2} className="bg-card" disabled>Этаж 2 (Скоро)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-muted/60 px-3 py-1.5 rounded-xl border border-border">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <input
              type="date"
              value={currentDateVal}
              min={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => handleDateChange(e.target.value)}
              className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center space-x-2 bg-muted/60 px-3 py-1.5 rounded-xl border border-border">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <select
              value={currentStartVal}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
            >
              {timeSlots.map((slot) => (
                <option key={`start-${slot}`} value={slot} className="bg-card">
                  {slot}
                </option>
              ))}
            </select>
            <span className="text-xs text-muted-foreground">до</span>
            <select
              value={currentEndVal}
              onChange={(e) => handleEndTimeChange(e.target.value)}
              className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
            >
              {timeSlots.filter((slot) => slot > currentStartVal).map((slot) => (
                <option key={`end-${slot}`} value={slot} className="bg-card">
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs font-medium">
          <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
            <span>{availableCount} свободно</span>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600" />
            <span>{occupiedCount} занято</span>
          </div>

          <div className="text-muted-foreground pl-2 border-l border-border hidden sm:block">
            Всего: {totalCount}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
        <div className="flex items-center space-x-1 bg-muted/50 p-1 rounded-xl border border-border">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              typeFilter === 'ALL'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Все места
          </button>
          <button
            onClick={() => setTypeFilter('DESK')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              typeFilter === 'DESK'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Только столы
          </button>
          <button
            onClick={() => setTypeFilter('MEETING_ROOM')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              typeFilter === 'MEETING_ROOM'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Только переговорные
          </button>
        </div>

        <label className="flex items-center space-x-2 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
          />
          <span>Только свободные</span>
        </label>
      </div>
    </div>
  );
};
