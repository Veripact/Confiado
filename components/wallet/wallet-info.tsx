"use client"

import { useState, useEffect } from "react"
import { useWeb3AuthUser, useWeb3AuthConnect } from "@web3auth/modal/react"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WalletInfo() {
  const { userInfo } = useWeb3AuthUser()
  const { isConnected } = useWeb3AuthConnect()
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [balance, setBalance] = useState<string>("0.00")
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const getWalletInfo = async () => {
      if (!isConnected || !userInfo) {
        setLoading(false)
        return
      }

      try {
        // For now, show user info without provider access
        console.log("UserInfo:", userInfo)
        
        // Extract wallet address from userInfo if available
        const wallets = (userInfo as any)?.wallets
        if (wallets && wallets.length > 0) {
          const address = wallets[0].address || wallets[0].public_key
          if (address) {
            setWalletAddress(address)
          }
        }
        
        setLoading(false)
      } catch (error) {
        console.error("Error getting wallet info:", error)
        setLoading(false)
      }
    }

    // Add delay to ensure provider is fully initialized
    const timer = setTimeout(getWalletInfo, 1000)
    return () => clearTimeout(timer)
  }, [isConnected, userInfo])

  const copyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!userInfo || loading) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Wallet className="w-3 h-3" />
        <span className="text-xs">Loading...</span>
      </Badge>
    )
  }

  if (!walletAddress) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Wallet className="w-3 h-3" />
        <span className="text-xs">No wallet</span>
      </Badge>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="flex items-center gap-1">
        <Wallet className="w-3 h-3" />
        <span className="font-mono text-xs">
          {balance} ETH
        </span>
      </Badge>
      <div className="flex items-center gap-1">
        <span className="font-mono text-xs text-muted-foreground">
          {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0"
          onClick={copyAddress}
        >
          {copied ? (
            <CheckCircle className="w-3 h-3 text-green-500" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </Button>
      </div>
    </div>
  )
}
