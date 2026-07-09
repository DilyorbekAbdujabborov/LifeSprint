import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from './api';
import type { AuthUser } from './api';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sahifa ochilganda tokenni tekshirib, sessiyani tiklaymiz
  useEffect(() => {
    const token = api.getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    api
      .fetchMe(controller.signal)
      .then((res) => setUser(res.user))
      .catch(() => { api.setToken(null); })
      .finally(() => { clearTimeout(timeout); setLoading(false); });
    return () => { clearTimeout(timeout); controller.abort(); };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    api.setToken(res.accessToken);
    api.setRefreshToken(res.refreshToken);
    setUser(res.user);
  };

  const register = async (name: string, email: string, password: string, role?: string) => {
    const res = await api.register({ name, email, password, role });
    api.setToken(res.accessToken);
    api.setRefreshToken(res.refreshToken);
    setUser(res.user);
  };

  const logout = () => {
    api.setToken(null);
    api.setRefreshToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth AuthProvider ichida ishlatilishi kerak.');
  return ctx;
}
