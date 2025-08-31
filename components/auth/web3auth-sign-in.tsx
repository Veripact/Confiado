"use client";

import React from "react";
import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { Button } from "@/components/ui/button";

const Web3AuthSignIn: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { connect, loading } = useWeb3AuthConnect();

  const handleSignIn = async () => {
    try {
      console.log("Starting Web3Auth connection...")
      const result = await connect();
      console.log("Web3Auth connection result:", result)
    } catch (error) {
      console.error("Web3Auth connection error:", error)
    }
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
