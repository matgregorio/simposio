import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api/client';

export type UserRole = 'admin' | 'sub-admin' | 'user' | 'avaliador-externo';

export interface AuthUser {
  id: string;
  nome: string;
  email?: string;
  role: UserRole;
}

type LoginRequest = { email: string; senha: string };

type LoginFunction = (payload: LoginRequest) => Promise<void>;

interface AuthContextData {
  user: AuthUser | null;
  loading: boolean;
  login: LoginFunction;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/me');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const login = useCallback(async ({ email, senha }: LoginRequest) => {
    await api.post('/auth/login', { email, senha });
    const response = await api.get('/users/me');
    setUser(response.data);
    navigate('/painel');
  }, [navigate]);

  const logout = useCallback(async () => {
    await api.post('/auth/logout');
    setUser(null);
    navigate('/entrar');
  }, [navigate]);

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
