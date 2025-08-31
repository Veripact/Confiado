'use client';

import { Web3AuthProvider, type Web3AuthContextConfig } from '@web3auth/modal/react';
import { IWeb3AuthState, WEB3AUTH_NETWORK } from '@web3auth/modal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!;
const queryClient = new QueryClient();

console.log('Web3Auth Client ID:', clientId ? 'Set' : 'Not set');
console.log('Web3Auth Network:', WEB3AUTH_NETWORK.SAPPHIRE_DEVNET);

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    sessionTime: 86400 * 7, // 7 days session
    uiConfig: {
      appName: process.env.NEXT_PUBLIC_APP_NAME || "Confiado",
      mode: "light",
      logoLight: "https://web3auth.io/images/web3authlog.png",
      logoDark: "https://web3auth.io/images/web3authlogodark.png",
      defaultLanguage: "en",
      loginMethodsOrder: ["google", "email_passwordless"],
    },
    enableLogging: true,
    storageKey: "web3auth_session",
  },
};

export default function Providers({ 
  children, 
  web3authInitialState 
}: {
  children: React.ReactNode,
  web3authInitialState?: IWeb3AuthState
}) {
  useEffect(() => {
    console.log('Web3Auth Provider initialized with config:', {
      clientId: clientId ? 'Set' : 'Not set',
      network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
      appName: process.env.NEXT_PUBLIC_APP_NAME || "Confiado",
      initialState: web3authInitialState ? 'Provided' : 'Not provided'
    });

    // Log initial state details
    if (web3authInitialState) {
      console.log('Web3Auth initial state provided');
    }
  }, [web3authInitialState]);

  return (
    <Web3AuthProvider config={web3AuthContextConfig} initialState={web3authInitialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Web3AuthProvider>
  );
}
