export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  invalidParams?: Record<string, string>;
}
