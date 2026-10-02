import React, { useEffect, useState } from 'react';
import { bookingsApi } from '../api/bookings.api';
import { Booking } from '../types/booking';
import { formatDateTime, formatTimeRange } from '../lib/utils';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  RefreshCw,
  XCircle,
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingsApi.getMyBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Не удалось загрузить бронирования');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm('Вы действительно хотите отменить эту бронь?')) {
      return;
    }
    setCancellingId(id);
    try {
      const updated = await bookingsApi.cancelBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Не удалось отменить бронирование');
    } finally {
      setCancellingId(null);
    }
  };

  const activeBookings = bookings.filter((b) => b.status === 'CONFIRMED');
  const pastBookings = bookings.filter((b) => b.status === 'CANCELLED');

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Мои бронирования</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Управляйте активными бронями или просматривайте историю.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          disabled={isLoading}
          className="self-start sm:self-auto inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-medium text-foreground transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-primary' : ''}`} />
          <span>Обновить</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Активные бронирования ({activeBookings.length})
        </h2>

        {isLoading && bookings.length === 0 ? (
          <div className="h-48 rounded-2xl border border-border bg-card/50 flex flex-col items-center justify-center space-y-2">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-xs text-muted-foreground">Загрузка ваших броней...</span>
          </div>
        ) : activeBookings.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-border bg-card/30 text-center space-y-2">
            <Calendar className="w-8 h-8 mx-auto text-muted-foreground/60" />
            <p className="text-sm font-medium text-foreground">Нет активных броней</p>
            <p className="text-xs text-muted-foreground">
              Перейдите на схему этажа, чтобы забронировать рабочее место или переговорную.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBookings.map((b) => (
              <div
                key={b.id}
                className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-border/80 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${
                          b.workspaceType === 'MEETING_ROOM'
                            ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {b.workspaceType === 'MEETING_ROOM' ? 'Переговорная' : 'Рабочий стол'}
                      </span>
                      <h3 className="text-base font-bold text-foreground mt-1">
                        {b.workspaceName}
                      </h3>
                    </div>

                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Подтверждено
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span className="font-medium text-foreground">
                        {formatTimeRange(b.startTime, b.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Этаж {b.floor}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Создано {formatDateTime(b.createdAt)}
                  </span>
                  <button
                    onClick={() => handleCancelBooking(b.id)}
                    disabled={cancellingId === b.id}
                    className="px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 text-xs font-medium transition-colors"
                  >
                    {cancellingId === b.id ? 'Отмена...' : 'Отменить бронь'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {pastBookings.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-border">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            История отмененных броней ({pastBookings.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
            {pastBookings.map((b) => (
              <div
                key={b.id}
                className="bg-card/60 border border-border rounded-2xl p-4 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{b.workspaceName}</span>
                  <span className="inline-flex items-center text-[10px] font-medium text-muted-foreground">
                    <XCircle className="w-3 h-3 mr-1" /> Отменено
                  </span>
                </div>
                <div className="text-muted-foreground">
                  {formatTimeRange(b.startTime, b.endTime)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
