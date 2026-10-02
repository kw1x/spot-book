import React, { useState } from 'react';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { Building2, KeyRound, Mail, ShieldAlert } from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
  onNavigateToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateToRegister,
}) => {
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState<string>('admin@spotbook.com');
  const [password, setPassword] = useState<string>('admin123');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ email, password });
      setAuth(response.token, response.user);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Неверный email или пароль');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Вход в SpotBook</h1>
          <p className="text-xs text-muted-foreground">
            Войдите для доступа к схеме этажа и бронированию мест.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center space-x-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Электронная почта</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@spotbook.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Пароль</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 shadow-sm transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <span>Войти в систему</span>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-border space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block text-center">
            Тестовые учетные записи
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@spotbook.com', 'admin123')}
              className="p-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground font-medium text-center transition-colors"
            >
              Администратор
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('employee@spotbook.com', 'admin123')}
              className="p-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground font-medium text-center transition-colors"
            >
              Сотрудник
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Нет аккаунта?{' '}
          <button
            onClick={onNavigateToRegister}
            className="font-semibold text-primary hover:underline ml-1"
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
};
