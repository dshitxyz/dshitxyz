'use client';

import { useMemo } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getConfig } from '@/config/wagmi';

export function ProvidersClient({ children }: { children: React.ReactNode }) {
  const config = useMemo(() => getConfig() as any, []);
  const queryClient = useMemo(() => new QueryClient(), []);

  if (!config) {
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
