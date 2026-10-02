import React, { useEffect, useState, useCallback } from 'react';
import { workspacesApi } from '../api/workspaces.api';
import { WorkspaceWithAvailability } from '../types/workspace';
import { useMapStore } from '../store/map.store';
import { FilterBar } from '../components/floor-map/FilterBar';
import { FloorMap } from '../components/floor-map/FloorMap';
import { BookingDrawer } from '../components/booking/BookingDrawer';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const MapPage: React.FC = () => {
  const { floor, fromTime, toTime } = useMapStore();
  const [workspaces, setWorkspaces] = useState<WorkspaceWithAvailability[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspaces = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await workspacesApi.getWorkspaces(floor, fromTime, toTime);
      setWorkspaces(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Не удалось загрузить рабочие места для этого этажа и времени');
    } finally {
      setIsLoading(false);
    }
  }, [floor, fromTime, toTime]);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Интерактивная схема этажа</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Выберите рабочий стол или переговорную на схеме, чтобы посмотреть детали и забронировать.
          </p>
        </div>

        <button
          onClick={fetchWorkspaces}
          disabled={isLoading}
          className="self-start sm:self-auto inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-medium text-foreground transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-primary' : ''}`} />
          <span>Обновить статус</span>
        </button>
      </div>

      <FilterBar workspaces={workspaces} />

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading && workspaces.length === 0 ? (
        <div className="h-96 rounded-2xl border border-border bg-card/50 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-xs text-muted-foreground font-medium">Загрузка схемы этажа...</span>
        </div>
      ) : (
        <FloorMap workspaces={workspaces} />
      )}

      <BookingDrawer onBookingCreated={fetchWorkspaces} />
    </div>
  );
};
