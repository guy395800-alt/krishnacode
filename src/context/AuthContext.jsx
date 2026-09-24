import React, { createContext, useContext, useState, useEffect } from 'react';





const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load auth token and user state from localStorage
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('nexgen_access_token');
      const storedUser = localStorage.getItem('nexgen_user');
      const storedTheme = (localStorage.getItem('nexgen_theme')) || 'dark';

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
      setLoading(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('nexgen_theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const login = async (email, password) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://krishnacodebackend.onrender.com/api/v1';
    let response;
    try {
      response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
    } catch (networkErr) {
      throw new Error('Backend server is not running or unreachable at https://krishnacodebackend.onrender.com. Please verify backend status.');
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Login failed. Incorrect email or password.');
    }

    const data = await response.json();
    const userObj = data.user;
    const jwtToken = data.access_token;

    setToken(jwtToken);
    setUser(userObj);

    localStorage.setItem('nexgen_access_token', jwtToken);
    localStorage.setItem('nexgen_user', JSON.stringify(userObj));

    return userObj;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('nexgen_access_token');
    localStorage.removeItem('nexgen_user');
    window.location.href = '/login';
  };

  const updateUser = (data) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('nexgen_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, theme, loading, login, logout, toggleTheme, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
