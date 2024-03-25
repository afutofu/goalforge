'use client';

import { SessionProvider } from 'next-auth/react';
import React, { type FC, type ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

interface IProvider {
  children: ReactNode;
}

export const Provider: FC<IProvider> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  );
};
