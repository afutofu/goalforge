'use client';

import { SessionProvider } from 'next-auth/react';
import React, { type FC, type ReactNode } from 'react';

interface IProvider {
  children: ReactNode;
}

export const Provider: FC<IProvider> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
