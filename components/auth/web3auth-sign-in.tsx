"use client";

import React, { useEffect } from "react";
import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { useWeb3AuthUser } from "@web3auth/modal/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Web3AuthSignIn: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { connect, isConnected } = useWeb3AuthConnect();
  const { userInfo } = useWeb3AuthUser();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Handle successful login
  useEffect(() => {
    if (isConnected && userInfo) {
      // Redirect to dashboard
      router.replace("/dashboard");
    }
  }, [isConnected, userInfo, router]);

  return (
    <Button
      onClick={handleSignIn}
      className={`w-full ${className}`}
      disabled={false}
    >
      Connect with Web3Auth
    </Button>
  );
};

export default Web3AuthSignIn;
