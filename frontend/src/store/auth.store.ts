import { create } from 'zustand';
import { User } from '../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem('spotbook_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  token: localStorage.getItem('spotbook_token'),
  isAuthenticated: !!localStorage.getItem('spotbook_token'),

  setAuth: (token: string, user: User) => {
    localStorage.setItem('spotbook_token', token);
    localStorage.setItem('spotbook_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('spotbook_token');
    localStorage.removeItem('spotbook_user');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
