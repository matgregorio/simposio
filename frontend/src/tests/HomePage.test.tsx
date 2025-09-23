import type { ReactNode } from 'react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../stores/AuthContext', () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: () => ({ user: null, loading: false, login: vi.fn(), logout: vi.fn() }),
}));

import { HomePage } from '../pages/public/HomePage';
import { AuthProvider } from '../stores/AuthContext';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Number.POSITIVE_INFINITY,
      },
    },
  });

describe('HomePage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createQueryClient();
    queryClient.setQueryData(
      ['subeventos'],
      [
        {
          _id: '1',
          titulo: 'Abertura oficial',
          tipo: 'Palestra',
          data: new Date().toISOString(),
          horario: '08:00',
          duracao: 60,
          vagas: 200,
          palestrante: 'Reitoria',
          local: 'Auditório principal',
          descricao: 'Sessão de abertura institucional do simpósio.',
        },
      ],
    );
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('renders highlights section', () => {
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <HomePage />
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>,
    );

    expect(screen.getByRole('heading', { name: /destaques da programação/i })).toBeInTheDocument();
  });
});
