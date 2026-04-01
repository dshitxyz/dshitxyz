'use client';

import React from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const chains = [base, baseSepolia];

const config = createConfig({
  chains,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
