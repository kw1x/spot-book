import api from './client';
import { Booking, CreateBookingPayload } from '../types/booking';

export const bookingsApi = {
  createBooking: async (payload: CreateBookingPayload): Promise<Booking> => {
    const response = await api.post<Booking>('/bookings', payload);
    return response.data;
  },

  getMyBookings: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/bookings/my');
    return response.data;
  },

  cancelBooking: async (id: string): Promise<Booking> => {
    const response = await api.patch<Booking>(`/bookings/${id}/cancel`);
    return response.data;
  },
};
