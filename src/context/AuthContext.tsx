'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
  walletAddress?: string;
  universityId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('certichain_token');
    const savedUser = localStorage.getItem('certichain_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Login failed');
    }

    const data = await res.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('certichain_token', data.token);
    localStorage.setItem('certichain_user', JSON.stringify(data.user));
  };

  const register = async (data: RegisterData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.error || 'Registration failed');
    }

    const result = await res.json();
    setToken(result.token);
    setUser(result.user);
    localStorage.setItem('certichain_token', result.token);
    localStorage.setItem('certichain_user', JSON.stringify(result.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('certichain_token');
    localStorage.removeItem('certichain_user');
  };

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && options.body) {
      headers.set('Content-Type', 'application/json');
    }
    return fetch(url, { ...options, headers });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
