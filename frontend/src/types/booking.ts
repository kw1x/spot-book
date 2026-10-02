import { WorkspaceType } from './workspace';

export type BookingStatus = 'CONFIRMED' | 'CANCELLED';

export interface Booking {
  id: string;
  workspaceId: string;
  workspaceName: string;
  workspaceType: WorkspaceType;
  floor: number;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
}

export interface CreateBookingPayload {
  workspaceId: string;
  startTime: string;
  endTime: string;
}
