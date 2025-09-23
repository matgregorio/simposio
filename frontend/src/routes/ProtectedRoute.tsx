import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../stores/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div role="status">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/entrar" replace />;
  }

  return children;
};
