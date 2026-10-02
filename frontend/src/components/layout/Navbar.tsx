import React from 'react';
import { useAuthStore } from '../../store/auth.store';
import { ThemeToggle } from './ThemeToggle';
import { Building2, Calendar, LayoutGrid, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  currentTab: 'map' | 'my-bookings' | 'admin';
  onTabChange: (tab: 'map' | 'my-bookings' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div
            onClick={() => onTabChange('map')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-foreground block leading-none">
                SpotBook
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground block mt-0.5">
                Бронирование мест
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onTabChange('map')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'map'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Схема этажа</span>
            </button>

            <button
              onClick={() => onTabChange('my-bookings')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'my-bookings'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Мои бронирования</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => onTabChange('admin')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === 'admin'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Администрирование</span>
              </button>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <ThemeToggle />

          {user && (
            <div className="flex items-center space-x-3 pl-2 border-l border-border">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-semibold text-foreground leading-tight">
                  {user.fullName}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  {isAdmin ? (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                      Администратор
                    </span>
                  ) : (
                    <span>{user.email}</span>
                  )}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-medium text-xs border border-border">
                {user.fullName.slice(0, 2).toUpperCase() || <UserIcon className="w-4 h-4" />}
              </div>

              <button
                onClick={logout}
                title="Выйти"
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden flex border-t border-border px-4 py-2 space-x-1 overflow-x-auto bg-card">
        <button
          onClick={() => onTabChange('map')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md text-center ${
            currentTab === 'map' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
          }`}
        >
          Схема этажа
        </button>
        <button
          onClick={() => onTabChange('my-bookings')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md text-center ${
            currentTab === 'my-bookings' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
          }`}
        >
          Мои бронирования
        </button>
        {isAdmin && (
          <button
            onClick={() => onTabChange('admin')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md text-center ${
              currentTab === 'admin' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            Админ
          </button>
        )}
      </div>
    </header>
  );
};
