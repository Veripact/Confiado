"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { PrivyProvider, usePrivy, useWallets } from "@privy-io/react-auth";
import { useAppStore } from "@/lib/store";

interface PrivyContextType {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: any;
  account: string;
  balance: string;
  login: () => void;
  logout: () => void;
  getUserInfo: () => any;
  getAccounts: () => string[];
  getBalance: () => Promise<string>;
  getChainId: () => Promise<string>;
}

const PrivyContext = createContext<PrivyContextType | undefined>(undefined);

// Privy Provider Wrapper Component
export function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmeyr16od00ejl20cufcucq0o"}
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        // Configure appearance
        appearance: {
          theme: 'light',
          accentColor: '#2563eb',
          logo: '/logo.svg',
        },
        // Configure supported login methods
        loginMethods: ['email', 'wallet'], // Google y Twitter deshabilitados temporalmente
        // Configure supported chains
        supportedChains: [
          {
            id: 4202, // Lisk Sepolia
            name: 'Lisk Sepolia',
            network: 'lisk-sepolia',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: {
              default: {
                http: ['https://rpc.sepolia-api.lisk.com'],
              },
              public: {
                http: ['https://rpc.sepolia-api.lisk.com'],
              },
            },
            blockExplorers: {
              default: {
                name: 'Lisk Sepolia Explorer',
                url: 'https://sepolia-blockscout.lisk.com',
              },
            },
            testnet: true,
          },
        ],
        defaultChain: {
          id: 4202,
          name: 'Lisk Sepolia',
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: {
            default: {
              http: ['https://rpc.sepolia-api.lisk.com'],
            },
          },
        },
      }}
    >
      <PrivyContextProvider>{children}</PrivyContextProvider>
    </PrivyProvider>
  );
}

// Internal Context Provider
function PrivyContextProvider({ children }: { children: ReactNode }) {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("0");
  const { updateUser } = useAppStore();

  // Get the primary wallet (embedded or connected)
  const primaryWallet = wallets.find(wallet => wallet.walletClientType === 'privy') || wallets[0];

  useEffect(() => {
    if (authenticated && user && primaryWallet) {
      setAccount(primaryWallet.address || "");
      
      // Update Zustand store with Privy user data
      updateUser({
        name: user.email?.address || user.google?.name || user.twitter?.username || "Privy User",
        email: user.email?.address || "",
        avatar: "",
      });

      // Get balance
      getBalance();
    } else {
      setAccount("");
      setBalance("0");
    }
  }, [authenticated, user, primaryWallet]);

  const getUserInfo = () => {
    return user;
  };

  const getAccounts = () => {
    return wallets.map(wallet => wallet.address).filter(Boolean) as string[];
  };

  const getBalance = async (): Promise<string> => {
    if (!primaryWallet) return "0";
    
    try {
      // Use Privy's built-in balance fetching if available
      // For now, return mock balance - in production you'd use the wallet's provider
      const mockBalance = "0.1"; // ETH
      setBalance(mockBalance);
      return mockBalance;
    } catch (error) {
      console.error("Error getting balance:", error);
      return "0";
    }
  };

  const getChainId = async (): Promise<string> => {
    if (!primaryWallet) return "4202"; // Default to Lisk Sepolia
    
    try {
      return primaryWallet.chainId?.toString() || "4202";
    } catch (error) {
      console.error("Error getting chain ID:", error);
      return "4202";
    }
  };

  const contextValue: PrivyContextType = {
    isLoading: !ready,
    isLoggedIn: authenticated,
    user,
    account,
    balance,
    login,
    logout,
    getUserInfo,
    getAccounts,
    getBalance,
    getChainId,
  };

  return (
    <PrivyContext.Provider value={contextValue}>
      {children}
    </PrivyContext.Provider>
  );
}

export function usePrivyAuth() {
  const context = useContext(PrivyContext);
  if (context === undefined) {
    throw new Error("usePrivyAuth must be used within a PrivyProviderWrapper");
  }
  return context;
}
