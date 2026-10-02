import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(isoString: string): string {
  try {
    return format(parseISO(isoString), 'd MMM yyyy, HH:mm', { locale: ru });
  } catch {
    return isoString;
  }
}

export function formatTimeRange(startIso: string, endIso: string): string {
  try {
    const start = parseISO(startIso);
    const end = parseISO(endIso);
    return `${format(start, 'EEE, d MMM · HH:mm', { locale: ru })} – ${format(end, 'HH:mm')}`;
  } catch {
    return `${startIso} - ${endIso}`;
  }
}

export function ensureUtcIso(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  if (dateStr.endsWith('Z') || dateStr.includes('+')) return dateStr;
  return `${dateStr}Z`;
}
