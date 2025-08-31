"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useWeb3AuthUser, useWeb3AuthConnect } from "@web3auth/modal/react"

export default function LandingPage() {
  const router = useRouter()
  const { userInfo, loading: authLoading } = useWeb3AuthUser()
  const { isConnected, connect, loading: connectLoading } = useWeb3AuthConnect()

  // Redirect to dashboard if already connected
  useEffect(() => {
    if (!authLoading && isConnected) {
      router.push("/dashboard")
    }
  }, [authLoading, isConnected, router])

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      console.error("Connection failed:", error)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-orange-400 to-yellow-400">
        <p className="text-lg text-white">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-orange-400 to-yellow-400 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10">
        <div className="w-6 h-6 bg-white rounded-full opacity-80"></div>
      </div>
      <div className="absolute top-32 left-20">
        <div className="w-4 h-4 bg-white rounded-full opacity-60"></div>
      </div>
      <div className="absolute top-16 right-16">
        <div className="w-8 h-8 bg-white rounded-full opacity-70"></div>
      </div>
      <div className="absolute bottom-20 left-16">
        <div className="w-5 h-5 bg-white rounded-full opacity-50"></div>
      </div>

      {/* Palm Tree Illustration */}
      <div className="absolute right-0 top-1/4 opacity-30">
        <svg width="200" height="300" viewBox="0 0 200 300" className="text-green-800">
          <path d="M100 250 Q95 200 90 150 Q85 100 100 50" stroke="currentColor" strokeWidth="8" fill="none"/>
          <ellipse cx="100" cy="40" rx="30" ry="15" fill="currentColor"/>
          <ellipse cx="80" cy="50" rx="25" ry="12" fill="currentColor"/>
          <ellipse cx="120" cy="50" rx="25" ry="12" fill="currentColor"/>
          <ellipse cx="70" cy="65" rx="20" ry="10" fill="currentColor"/>
          <ellipse cx="130" cy="65" rx="20" ry="10" fill="currentColor"/>
        </svg>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold text-white">CONFIADO</div>
          </div>
          
          <Button
            onClick={handleConnect}
            disabled={connectLoading}
            className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-full font-medium"
          >
            {connectLoading ? "Conectando..." : "Connect"}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-32 pb-12 relative z-5">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          {/* Left Side - Content */}
          <div className="text-left">
            <h1 className="text-6xl md:text-7xl font-black text-black mb-6 leading-none">
              MANAGE & TRACK
              <br />
              <span className="text-black">DEBTS,</span>
              <br />
              <span className="text-black">WITH ONE</span>
              <br />
              <span className="text-black">CLICK.</span>
            </h1>
            
            <p className="text-lg text-black/80 mb-8 max-w-md">
              Track your debts and credits securely on blockchain. 
              Fast, transparent and decentralized debt management.
            </p>

            <div className="flex flex-col gap-4">
              <Button
                onClick={handleConnect}
                disabled={connectLoading}
                size="lg"
                className="bg-black text-white hover:bg-gray-800 px-8 py-4 rounded-full text-lg font-medium w-fit"
              >
                {connectLoading ? "Connecting..." : "Register"}
              </Button>
              
              <p className="text-sm text-black/60">
                Connect your wallet to start
              </p>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="relative">
            {/* City Illustration */}
            <div className="relative">
              <svg viewBox="0 0 400 300" className="w-full h-auto">
                {/* Buildings */}
                <rect x="50" y="150" width="40" height="100" fill="#FF6B6B" rx="4"/>
                <rect x="100" y="120" width="35" height="130" fill="#4ECDC4" rx="4"/>
                <rect x="145" y="140" width="45" height="110" fill="#45B7D1" rx="4"/>
                <rect x="200" y="100" width="40" height="150" fill="#96CEB4" rx="4"/>
                <rect x="250" y="130" width="38" height="120" fill="#FFEAA7" rx="4"/>
                <rect x="300" y="110" width="42" height="140" fill="#DDA0DD" rx="4"/>
                
                {/* Windows */}
                <rect x="55" y="160" width="6" height="8" fill="white"/>
                <rect x="65" y="160" width="6" height="8" fill="white"/>
                <rect x="75" y="160" width="6" height="8" fill="white"/>
                <rect x="55" y="180" width="6" height="8" fill="white"/>
                <rect x="65" y="180" width="6" height="8" fill="white"/>
                <rect x="75" y="180" width="6" height="8" fill="white"/>
                
                <rect x="105" y="130" width="6" height="8" fill="white"/>
                <rect x="115" y="130" width="6" height="8" fill="white"/>
                <rect x="125" y="130" width="6" height="8" fill="white"/>
                <rect x="105" y="150" width="6" height="8" fill="white"/>
                <rect x="115" y="150" width="6" height="8" fill="white"/>
                <rect x="125" y="150" width="6" height="8" fill="white"/>
                
                {/* CANNES text */}
                <text x="150" y="280" fill="#2D3436" fontSize="16" fontWeight="bold">CANNES</text>
                
                {/* Water/Beach */}
                <ellipse cx="200" cy="270" rx="150" ry="20" fill="#74B9FF" opacity="0.6"/>
              </svg>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
