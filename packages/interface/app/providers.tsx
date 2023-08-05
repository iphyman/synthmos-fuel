'use client';

import { ReactNode } from 'react';
import {
  ChakraProvider,
  cookieStorageManagerSSR,
  localStorageManager,
} from '@chakra-ui/react';
import { CacheProvider } from '@chakra-ui/next-js';
import { QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@app/theme';
import { queryClient } from '@app/configs';
export default function Providers({
  children,
  cookie,
}: {
  children: ReactNode;
  cookie?: string;
}) {
  return (
    <CacheProvider>
      <ChakraProvider
        colorModeManager={
          typeof cookie === 'string'
            ? cookieStorageManagerSSR(cookie)
            : localStorageManager
        }
        theme={theme}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
