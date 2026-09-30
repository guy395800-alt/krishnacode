'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load auth token and user state from localStorage
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('nexgen_access_token');
      const storedUser = localStorage.getItem('nexgen_user');
      const storedTheme = (localStorage.getItem('nexgen_theme') as 'dark' | 'light') || 'dark';

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse cached user data', e);
        }
      }
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
      setLoading(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme: 'dark' | 'light' = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexgen_theme', nextTheme);
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://krishnacodebackend.onrender.com/api/v1';
    let response: Response;
    try {
      response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
    } catch (networkErr) {
      throw new Error('Backend server is not reachable at https://krishnacodebackend.onrender.com. Please verify backend service.');
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Login failed. Incorrect email or password.');
    }

    const data = await response.json();
    const userObj: User = data.user;
    const jwtToken: string = data.access_token;

    setToken(jwtToken);
    setUser(userObj);

    if (typeof window !== 'undefined') {
      localStorage.setItem('nexgen_access_token', jwtToken);
      localStorage.setItem('nexgen_user', JSON.stringify(userObj));
    }

    return userObj;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nexgen_access_token');
      localStorage.removeItem('nexgen_user');
      window.location.href = '/login';
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated: User = { ...user, ...data };
      setUser(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexgen_user', JSON.stringify(updated));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, theme, loading, login, logout, toggleTheme, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
