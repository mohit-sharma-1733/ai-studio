import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import apiClient from '../lib/axios';

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    const { token: newToken } = res.data;
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const signup = async (email: string, password: string) => {
    const res = await apiClient.post('/auth/signup', { email, password });
    const { token: newToken } = res.data;
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, signup, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
