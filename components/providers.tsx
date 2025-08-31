'use client';

import { Web3AuthProvider, type Web3AuthContextConfig } from '@web3auth/modal/react';
import { IWeb3AuthState, WEB3AUTH_NETWORK, CHAIN_NAMESPACES } from '@web3auth/modal';
import { WagmiProvider } from '@web3auth/modal/react/wagmi';
import { WalletServicesPlugin } from '@web3auth/wallet-services-plugin';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!;
const queryClient = new QueryClient();

// Lisk Sepolia configuration
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x106A", // 4202 in hex (Lisk Sepolia)
  rpcTarget: "https://rpc.sepolia-api.lisk.com",
  displayName: "Lisk Sepolia Testnet",
  blockExplorerUrl: "https://sepolia-blockscout.lisk.com",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    privateKeyProvider,
    ssr: true,
    uiConfig: {
      appName: "Confiado",
      mode: "light",
      logoLight: "https://web3auth.io/images/web3authlog.png",
      logoDark: "https://web3auth.io/images/web3authlogodark.png",
      defaultLanguage: "en",
      loginMethodsOrder: ["google", "facebook", "twitter", "discord", "twitch"],
    },
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
    <Web3AuthProvider config={web3AuthContextConfig} initialState={web3authInitialState}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </Web3AuthProvider>
  );
}
