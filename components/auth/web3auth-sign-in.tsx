"use client";

import React from "react";
import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { Button } from "@/components/ui/button";

const Web3AuthSignIn: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { connect, loading } = useWeb3AuthConnect();

  const handleSignIn = async () => {
    await connect();
  };

  return (
    <Button
      onClick={handleSignIn}
      className={`w-full ${className}`}
      disabled={loading}
    >
{loading ? "Connecting..." : "Connect with Web3Auth"}
    </Button>
  );
};

export default Web3AuthSignIn;
