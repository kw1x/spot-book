import React, { useEffect, useState } from 'react';
import { useAuthStore } from './store/auth.store';
import { Navbar } from './components/layout/Navbar';
import { MapPage } from './pages/MapPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export const App: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [currentTab, setCurrentTab] = useState<'map' | 'my-bookings' | 'admin'>('map');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      setAuthView('login');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);

  if (!isAuthenticated) {
    if (authView === 'register') {
      return (
        <RegisterPage
          onSuccess={() => setCurrentTab('map')}
          onNavigateToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <LoginPage
        onSuccess={() => setCurrentTab('map')}
        onNavigateToRegister={() => setAuthView('register')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'map' && <MapPage />}
        {currentTab === 'my-bookings' && <MyBookingsPage />}
        {currentTab === 'admin' && user?.role === 'ROLE_ADMIN' && <AdminPage />}
      </main>
    </div>
  );
};

export default App;
