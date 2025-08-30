"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { IProvider } from "@web3auth/base";
import web3auth from "@/lib/web3auth";
import { Web3RPC } from "@/lib/web3RPC";
import { useAppStore } from "@/lib/store";

interface Web3AuthContextType {
  provider: IProvider | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  user: any;
  account: string;
  balance: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  getAccounts: () => Promise<string[]>;
  getBalance: () => Promise<string>;
  getChainId: () => Promise<string>;
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(undefined);

export function Web3AuthProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("0");
  const { updateUser } = useAppStore();

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.init();
        
        if (web3auth.connected) {
          setProvider(web3auth.provider);
          setIsLoggedIn(true);
          const user = await web3auth.getUserInfo();
          setUser(user);
          
          if (web3auth.provider) {
            const accounts = await Web3RPC.getAccounts(web3auth.provider);
            const balance = await Web3RPC.getBalance(web3auth.provider);
            setAccount(accounts[0] || "");
            setBalance(balance);
            
            // Update Zustand store with Web3Auth user data
            updateUser({
              name: user?.name || "Web3 User",
              email: user?.email || "",
              avatar: user?.profileImage || "",
            });
          }
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = async () => {
    try {
      setIsLoading(true);
      const web3authProvider = await web3auth.connect();
      
      if (web3authProvider) {
        setProvider(web3authProvider);
        setIsLoggedIn(true);
        
        const user = await web3auth.getUserInfo();
        setUser(user);
        
        const accounts = await Web3RPC.getAccounts(web3authProvider);
        const balance = await Web3RPC.getBalance(web3authProvider);
        setAccount(accounts[0] || "");
        setBalance(balance);
        
        // Update Zustand store with Web3Auth user data
        updateUser({
          name: user?.name || "Web3 User",
          email: user?.email || "",
          avatar: user?.profileImage || "",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setIsLoggedIn(false);
      setProvider(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await web3auth.logout();
      setProvider(null);
      setIsLoggedIn(false);
      setUser(null);
      setAccount("");
      setBalance("0");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const getUserInfo = async () => {
    if (web3auth.connected) {
      const user = await web3auth.getUserInfo();
      setUser(user);
      return user;
    }
    return null;
  };

  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return [];
    }
    
    try {
      return await Web3RPC.getAccounts(provider);
    } catch (error) {
      console.error("Error getting accounts:", error);
      return [];
    }
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return "0";
    }

    try {
      return await Web3RPC.getBalance(provider);
    } catch (error) {
      console.error("Error getting balance:", error);
      return "0";
    }
  };

  const getChainId = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return "0";
    }

    try {
      return await Web3RPC.getChainId(provider);
    } catch (error) {
      console.error("Error getting chain ID:", error);
      return "0";
    }
  };

  const contextValue: Web3AuthContextType = {
    provider,
    isLoading,
    isLoggedIn,
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
    <Web3AuthContext.Provider value={contextValue}>
      {children}
    </Web3AuthContext.Provider>
  );
}

export function useWeb3Auth() {
  const context = useContext(Web3AuthContext);
  if (context === undefined) {
    throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
  }
  return context;
}
