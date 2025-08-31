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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center space-x-2">
            <div className="text-xl font-bold text-gray-900">CONFIADO</div>
          </div>
          
          <Button
            onClick={handleConnect}
            disabled={connectLoading}
            className="bg-gray-900 text-white hover:bg-gray-700 px-5 py-2 rounded-md font-medium"
          >
            {connectLoading ? "Conectando..." : "Connect"}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Manage & Track Debts,
              <br />
              <span className="text-blue-600">With One Click</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Track your debts and credits securely on the blockchain. Fast, transparent, and decentralized debt management to build your trust profile.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Button
                onClick={handleConnect}
                disabled={connectLoading}
                size="lg"
                className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-md text-lg font-semibold w-full sm:w-auto"
              >
                {connectLoading ? "Connecting..." : "Secure My Pacts"}
              </Button>
              
              <p className="text-sm text-gray-500">
                Connect your wallet to get started.
              </p>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="relative hidden lg:flex items-center justify-center">
            <svg viewBox="0 0 400 300" className="w-full h-auto">
                {/* Background shapes */}
                <circle cx="200" cy="150" r="140" fill="gray" opacity="0.05"/>
                <circle cx="200" cy="150" r="100" fill="gray" opacity="0.05"/>

                {/* Connections */}
                <path d="M200,150 C140,125 110,125 80,100" stroke="#D1D5DB" strokeWidth="2" fill="none"/>
                <path d="M200,150 C140,175 110,175 80,200" stroke="#D1D5DB" strokeWidth="2" fill="none"/>
                <path d="M200,150 C260,125 290,125 320,100" stroke="#D1D5DB" strokeWidth="2" fill="none"/>
                <path d="M200,150 C260,175 290,175 320,200" stroke="#D1D5DB" strokeWidth="2" fill="none"/>
                <path d="M200,150 C200,100 200,80 200,50" stroke="#D1D5DB" strokeWidth="2" fill="none"/>

                {/* Nodes */}
                <circle cx="80" cy="100" r="10" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="2"/>
                <circle cx="80" cy="200" r="10" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="2"/>
                <circle cx="320" cy="100" r="10" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="2"/>
                <circle cx="320" cy="200" r="10" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="2"/>
                <circle cx="200" cy="50" r="10" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="2"/>

                {/* Central Node */}
                <circle cx="200" cy="150" r="25" fill="#2563EB"/>
                <text x="200" y="156" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">C</text>
            </svg>
          </div>
        </div>
      </main>
    </div>
  )
}
