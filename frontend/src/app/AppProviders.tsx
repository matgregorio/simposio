import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from './i18n';
import { AuthProvider } from '../stores/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const memoizedClient = useMemo(() => queryClient, []);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={memoizedClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
};
