'use client';

import { Web3AuthProvider, type Web3AuthContextConfig, useWeb3AuthUser, useWeb3AuthConnect, useWeb3Auth, useWeb3AuthDisconnect } from '@web3auth/modal/react';
import { IWeb3AuthState, WEB3AUTH_NETWORK } from '@web3auth/modal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useState, createContext } from 'react';

const queryClient = new QueryClient();

// Lightweight context to share auth state safely without requiring callers to use @web3auth hooks
type Web3AuthBridgeValue = {
  userInfo: any | null,
  isConnected: boolean,
  loading: boolean,
  provider: any | null,
  status?: any,
  disconnect: (options?: any) => Promise<void>,
  connect: (...args: any[]) => Promise<any | null>,
}

export const Web3AuthBridgeContext = createContext<Web3AuthBridgeValue>({
  userInfo: null,
  isConnected: false,
  loading: true,
  provider: null,
  status: null,
  disconnect: async () => {},
  connect: async () => null,
});

function Web3AuthBridge({ children }: { children: React.ReactNode }) {
  // These hooks are safe to call here because this component will be rendered inside Web3AuthProvider
  const userHook = useWeb3AuthUser();
  const connectHook = useWeb3AuthConnect();
  const disconnectHook = useWeb3AuthDisconnect();
  const web3AuthHook = useWeb3Auth();

  const { userInfo, loading } = userHook || {};
  const { isConnected } = connectHook || {};
  const { connect } = connectHook || {};
  const { disconnect } = disconnectHook || {};
  const { provider, status } = web3AuthHook || {};

  const bridgeValue = {
    userInfo: userInfo || null,
    isConnected: !!isConnected,
    loading: !!loading,
    provider: provider || null,
    status: status || null,
    disconnect: disconnect || (async () => {}),
    connect: connect || (async () => null),
  };

  return (
    <Web3AuthBridgeContext.Provider value={bridgeValue}>
      {children}
    </Web3AuthBridgeContext.Provider>
  );
}

export default function Providers({ 
  children, 
  web3authInitialState 
}: {
  children: React.ReactNode,
  web3authInitialState?: IWeb3AuthState
}) {
  const [clientId, setClientId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only access environment variables on the client side
    setIsClient(true);
    const id = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
    setClientId(id || null);
    
    console.log('🔍 Debug - Client-side environment check:');
    console.log('NEXT_PUBLIC_WEB3AUTH_CLIENT_ID exists:', !!id);
    console.log('Client ID value:', id);
    console.log('Client ID length:', id?.length);
  }, []);

  console.log('Web3Auth Network:', WEB3AUTH_NETWORK.SAPPHIRE_DEVNET);

  const web3AuthContextConfig: Web3AuthContextConfig = {
    web3AuthOptions: {
      clientId: clientId!, // Now clientId is guaranteed to be available
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
    },
  };

  const fallbackConfig: Web3AuthContextConfig = {
    web3AuthOptions: {
      clientId: 'fallback-client-id', // This will cause Web3Auth to show an error, but hooks will work
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
    },
  };

  useEffect(() => {
    if (isClient) {
      console.log('Web3Auth Provider initialized with config:', {
        clientId: clientId ? 'Set' : 'Not set',
        network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
        appName: process.env.NEXT_PUBLIC_APP_NAME || "Confiado",
        initialState: web3authInitialState ? 'Provided' : 'Not provided'
      });
    }
  }, [isClient, clientId, web3authInitialState]);

  // Always render a Web3AuthProvider even during initial client mount
  // This prevents child components from calling Web3Auth hooks before the context exists
  if (!isClient) {
    console.log('⏳ Client not ready, rendering with fallback Web3AuthProvider to ensure context is available...');
    return (
      <Web3AuthProvider config={fallbackConfig} initialState={web3authInitialState}>
        <QueryClientProvider client={queryClient}>
          <div style={{ padding: '8px', backgroundColor: '#fff7ed', border: '1px solid #ffe1b8', borderRadius: '4px', marginBottom: '8px' }}>
            <strong>Initializing...</strong> Preparing authentication context.
          </div>
          {children}
        </QueryClientProvider>
      </Web3AuthProvider>
    );
  }

  if (!clientId || clientId.length < 10) {
    // Client is ready but no valid clientId - use fallback config
    console.warn('⚠️ Web3Auth clientId is missing or invalid, using fallback configuration');
    console.warn('Please set NEXT_PUBLIC_WEB3AUTH_CLIENT_ID in your environment variables');
    return (
      <Web3AuthProvider config={fallbackConfig} initialState={web3authInitialState}>
        <QueryClientProvider client={queryClient}>
          <div style={{ padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px', marginBottom: '10px' }}>
            <strong>⚠️ Configuration Warning:</strong> Web3Auth clientId is not configured. Authentication may not work properly.
          </div>
          {children}
        </QueryClientProvider>
      </Web3AuthProvider>
    );
  }

  return (
    <Web3AuthProvider config={web3AuthContextConfig} initialState={web3authInitialState}>
      <Web3AuthBridge>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Web3AuthBridge>
    </Web3AuthProvider>
  );
}
