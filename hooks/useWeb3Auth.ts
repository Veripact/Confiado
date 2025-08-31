// hooks/useWeb3Auth.ts
import { useWeb3AuthUser, useWeb3AuthConnect, useWeb3AuthDisconnect } from '@web3auth/modal/react';
import { useState, useEffect } from 'react';

export const useWeb3AuthLogic = () => {
  const { userInfo } = useWeb3AuthUser();
  const { isConnected, connect } = useWeb3AuthConnect();
  const { disconnect } = useWeb3AuthDisconnect();
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize account and balance when connected
  useEffect(() => {
    const initializeWallet = async () => {
      if (userInfo && isConnected) {
        try {
          // Extract wallet info from userInfo
          const wallets = (userInfo as any)?.wallets;
          if (wallets && wallets.length > 0) {
            const address = wallets[0].address || wallets[0].public_key;
            setAccount(address || "");
          }
        } catch (error) {
          console.error("Error initializing wallet:", error);
        }
      } else {
        setAccount("");
        setBalance("");
      }
    };

    initializeWallet();
  }, [userInfo, isConnected]);

  // Login function
  const login = async () => {
    try {
      setIsLoading(true);
      await connect();
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await disconnect();
      setAccount("");
      setBalance("");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    userInfo,
    isConnected,
    account,
    balance,
    isLoading,
    
    // Actions
    login,
    logout: handleLogout,
  };
};
