"use client";
import React, { useState } from "react";
import { useWeb3AuthLogic } from "@/hooks/useWeb3Auth";
import { ENSInput } from "@/components/ens/ens-input";
import { ENSDisplay } from "@/components/ens/ens-display";
import { useEnsName, useEnsAvatar, useEnsAddress } from 'wagmi';

export default function Web3TestPage() {
  const {
    userInfo,
    isConnected,
    account,
    balance,
    isLoading,
    login,
    logout,
  } = useWeb3AuthLogic();

  const [transactionResult, setTransactionResult] = useState<string>("");
  const [signedMessage, setSignedMessage] = useState<string>("");
  const [chainId, setChainId] = useState<string>("");
  const [testAddress] = useState<string>("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"); // vitalik.eth
  
  // Test ENS resolution with known addresses
  const { data: vitalikName } = useEnsName({ 
    address: testAddress as `0x${string}`, 
    chainId: 1 
  });
  const { data: vitalikAvatar } = useEnsAvatar({ 
    name: vitalikName || undefined, 
    chainId: 1 
  });
  const { data: vitalikAddress } = useEnsAddress({ 
    name: "vitalik.eth", 
    chainId: 1 
  });

  // Handle send transaction - simplified for now
  const handleSendTransaction = async () => {
    setTransactionResult("Transaction functionality not implemented yet");
  };

  // Handle sign message - simplified for now
  const handleSignMessage = async () => {
    setSignedMessage("Message signing not implemented yet");
  };

  // Handle get chain ID - simplified for now
  const handleGetChainId = async () => {
    setChainId("Chain ID functionality not implemented yet");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Web3Auth Test - Confiado</h1>
        
        {!isConnected ? (
          <div className="text-center">
            <div className="bg-card p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
              <p className="text-muted-foreground mb-6">
                Connect with Web3Auth to access Confiado debt management features
              </p>
              <button 
                onClick={login}
                disabled={isLoading}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-card p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Profile</h3>
              <div className="space-y-2">
                <p><strong>Wallet Address:</strong> {account}</p>
                <p><strong>Balance:</strong> {balance} ETH</p>
                <p><strong>Network:</strong> Lisk Sepolia Testnet</p>
              </div>
            </div>

            {/* ENS Testing Section */}
            <div className="bg-card p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">ENS Testing</h3>
              
              {/* Test with known ENS */}
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Test: vitalik.eth Resolution</h4>
                  <div className="space-y-2">
                    <p><strong>ENS Name:</strong> {vitalikName || "Loading..."}</p>
                    <p><strong>Address:</strong> {vitalikAddress || "Loading..."}</p>
                    <p><strong>Avatar:</strong> {vitalikAvatar ? "✅ Found" : "❌ Not found"}</p>
                    {vitalikAvatar && (
                      <img src={vitalikAvatar} alt="Vitalik Avatar" className="h-12 w-12 rounded-full" />
                    )}
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">ENS Resolver Tool</h4>
                  <ENSInput 
                    placeholder="Try: vitalik.eth, nick.eth, or any 0x address"
                    onAddressResolved={(addr, name) => console.log('Resolved:', addr, name)}
                  />
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Your Wallet ENS</h4>
                  {account && (
                    <ENSDisplay address={account} />
                  )}
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="bg-card p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Web3 Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={handleGetChainId}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Get Chain ID
                </button>
                <button 
                  onClick={handleSignMessage}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Sign Message
                </button>
                <button 
                  onClick={handleSendTransaction}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                  Send Test Transaction
                </button>
              </div>
            </div>

            {/* Results Section */}
            {(chainId || signedMessage || transactionResult) && (
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Results</h3>
                <div className="space-y-4">
                  {chainId && (
                    <div>
                      <strong>Chain ID:</strong>
                      <pre className="bg-muted p-2 rounded mt-1 text-sm">{chainId}</pre>
                    </div>
                  )}
                  {signedMessage && (
                    <div>
                      <strong>Signed Message:</strong>
                      <pre className="bg-muted p-2 rounded mt-1 text-sm break-all">{signedMessage}</pre>
                    </div>
                  )}
                  {transactionResult && (
                    <div>
                      <strong>Transaction Result:</strong>
                      <pre className="bg-muted p-2 rounded mt-1 text-sm overflow-auto max-h-40">{transactionResult}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Logout Section */}
            <div className="text-center">
              <button 
                onClick={logout}
                disabled={isLoading}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {isLoading ? "Disconnecting..." : "Disconnect Wallet"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
