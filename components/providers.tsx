'use client';

import { Web3AuthProvider, type Web3AuthContextConfig } from '@web3auth/modal/react';
import { IWeb3AuthState, WEB3AUTH_NETWORK } from '@web3auth/modal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { createConfig, http } from 'wagmi';
import React from 'react';

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!;
const queryClient = new QueryClient();

// Wagmi configuration for ENS
const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    ssr: true,
  },
};

export default function Providers({
  children,
  web3authInitialState
}: {
  children: React.ReactNode,
  web3authInitialState?: IWeb3AuthState
}) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Web3AuthProvider config={web3AuthContextConfig} initialState={web3authInitialState}>
          {children}
        </Web3AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}