'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3AuthDisconnect, useWeb3AuthConnect } from '@web3auth/modal/react';
import { Button } from '@/components/ui/button';

type LogoutButtonProps = {
  className?: string;
};

const Web3AuthLogout: React.FC<LogoutButtonProps> = ({ className = '' }) => {
  const router = useRouter();

  // Handle Web3Auth hooks with error handling
  let disconnect = async () => {};
  let isConnected = false;

  try {
    const disconnectResult = useWeb3AuthDisconnect();
    const connectResult = useWeb3AuthConnect();
    disconnect = disconnectResult.disconnect;
    isConnected = connectResult.isConnected;
  } catch (error) {
    // Web3Auth hooks failed, likely because provider is not available
    console.log('Web3Auth hooks not available in Web3AuthLogout:', error);
  }

  const handleLogout = async () => {
    console.log('Logging out...');
    if (!isConnected) {
      console.warn('Web3Auth is not connected, cannot log out.');
      return;
    }
    await disconnect();
    router.replace('/auth/signin');
  };

  return (
    <Button
      onClick={handleLogout}
      variant="destructive"
      className={`${className}`}
    >
      Log Out
    </Button>
  );
};

export default Web3AuthLogout;
