import React, { useState } from 'react';
import { useMapStore } from '../../store/map.store';
import { bookingsApi } from '../../api/bookings.api';
import { formatTimeRange, ensureUtcIso } from '../../lib/utils';
import {
  AlertCircle,
  Building,
  CheckCircle2,
  Clock,
  MapPin,
  Monitor,
  ShieldAlert,
  Users,
  X,
} from 'lucide-react';

interface BookingDrawerProps {
  onBookingCreated: () => void;
}

export const BookingDrawer: React.FC<BookingDrawerProps> = ({ onBookingCreated }) => {
  const { selectedWorkspace, resetSelection, fromTime, toTime } = useMapStore();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!selectedWorkspace) return null;

  const isMeetingRoom = selectedWorkspace.type === 'MEETING_ROOM';
  const isAvailable = selectedWorkspace.isAvailable;

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await bookingsApi.createBooking({
        workspaceId: selectedWorkspace.id,
        startTime: ensureUtcIso(fromTime) || fromTime,
        endTime: ensureUtcIso(toTime) || toTime,
      });

      setSuccessMsg('Бронирование успешно подтверждено!');
      setTimeout(() => {
        onBookingCreated();
        resetSelection();
        setSuccessMsg(null);
      }, 1200);
    } catch (err: any) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Не удалось подтвердить бронирование. Попробуйте другой интервал.';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-card border-l border-border shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
      <div className="p-6 overflow-y-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                isMeetingRoom
                  ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isMeetingRoom ? 'Переговорная' : 'Рабочий стол'}
            </span>
            <h2 className="text-xl font-bold text-foreground mt-1">
              {selectedWorkspace.name}
            </h2>
          </div>

          <button
            onClick={() => resetSelection()}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`p-4 rounded-xl border flex items-center space-x-3 ${
            isAvailable
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
              : 'bg-slate-500/10 border-slate-500/30 text-slate-800 dark:text-slate-300'
          }`}
        >
          {isAvailable ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-slate-500 shrink-0" />
          )}
          <div className="text-xs">
            <p className="font-semibold">
              {isAvailable ? 'Свободно на выбранное время' : 'Занято на выбранное время'}
            </p>
            <p className="text-[11px] opacity-80 mt-0.5">
              {isAvailable
                ? 'Готово к мгновенному бронированию'
                : 'Другой коллега уже забронировал это место'}
            </p>
          </div>
        </div>

        <div className="bg-muted/40 border border-border rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Время бронирования
          </h3>
          <div className="flex items-center space-x-2.5 text-sm font-medium text-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>{formatTimeRange(fromTime, toTime)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Параметры места
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-muted/30 border border-border p-3 rounded-xl flex items-center space-x-2.5">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <span className="block text-muted-foreground text-[10px]">Вместимость</span>
                <span className="font-semibold text-foreground">
                  {selectedWorkspace.capacity} чел.
                </span>
              </div>
            </div>

            <div className="bg-muted/30 border border-border p-3 rounded-xl flex items-center space-x-2.5">
              <Building className="w-4 h-4 text-muted-foreground" />
              <div>
                <span className="block text-muted-foreground text-[10px]">Этаж</span>
                <span className="font-semibold text-foreground">Этаж {selectedWorkspace.floor}</span>
              </div>
            </div>

            <div className="bg-muted/30 border border-border p-3 rounded-xl flex items-center space-x-2.5">
              <Monitor className="w-4 h-4 text-muted-foreground" />
              <div>
                <span className="block text-muted-foreground text-[10px]">Оснащение</span>
                <span className="font-semibold text-foreground">
                  {isMeetingRoom ? '4K Экран + Аудио' : 'Монитор и периферия'}
                </span>
              </div>
            </div>

            <div className="bg-muted/30 border border-border p-3 rounded-xl flex items-center space-x-2.5">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <span className="block text-muted-foreground text-[10px]">Координаты</span>
                <span className="font-semibold text-foreground">
                  X:{selectedWorkspace.posX} Y:{selectedWorkspace.posY}
                </span>
              </div>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-border bg-card/60 backdrop-blur space-y-2">
        <button
          onClick={handleConfirmBooking}
          disabled={!isAvailable || isSubmitting}
          className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center space-x-2 ${
            isAvailable
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99]'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center space-x-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Бронирование...</span>
            </span>
          ) : isAvailable ? (
            <span>Подтвердить бронь</span>
          ) : (
            <span>Место занято</span>
          )}
        </button>

        <button
          onClick={() => resetSelection()}
          className="w-full py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};
