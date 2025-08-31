"use client"

import { useState, useEffect, useContext } from "react"
import { Web3AuthBridgeContext } from '@/components/providers'
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WalletInfo() {
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [balance, setBalance] = useState<string>("0.00")
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use the bridge to access auth state and provider safely
  const bridge = useContext(Web3AuthBridgeContext)
  const { userInfo, isConnected, provider, loading: bridgeLoading } = bridge || { userInfo: null, isConnected: false, provider: null, loading: true }
  const userLoading = bridgeLoading

  // Check if Web3Auth is available
  const isWeb3AuthAvailable = !!bridge

  if (!isWeb3AuthAvailable) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Wallet className="w-3 h-3" />
        <span className="text-xs">Service unavailable</span>
      </Badge>
    )
  }

  useEffect(() => {
    const getWalletInfo = async () => {
      if (!provider || !userInfo || !isConnected) {
        setLoading(false)
        return
      }

      try {
        setError(null)
        
        // Get wallet address from Web3Auth provider
        const accounts = await provider.request({ method: "eth_accounts" }) as string[]
        console.log("Web3Auth accounts:", accounts)
        console.log("UserInfo:", userInfo)
        
        if (accounts && Array.isArray(accounts) && accounts.length > 0) {
          const address = accounts[0]
          setWalletAddress(address)
          
          // Get balance
          const balanceHex = await provider.request({
            method: "eth_getBalance",
            params: [address, "latest"]
          }) as string
          
          const balanceWei = parseInt(balanceHex, 16)
          const balanceEth = balanceWei / 1e18
          setBalance(balanceEth.toFixed(4))
        } else {
          setError('No wallet accounts found')
        }
      } catch (error) {
        console.error("Error getting wallet info:", error)
        setError('Failed to load wallet information')
      } finally {
        setLoading(false)
      }
    }

    getWalletInfo()
  }, [provider, userInfo, isConnected])

  const copyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Failed to copy address:', error)
      }
    }
  }

  if (error) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Wallet className="w-3 h-3" />
        <span className="text-xs">Error</span>
      </Badge>
    )
  }

  if (!userInfo || userLoading || loading) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Wallet className="w-3 h-3" />
        <span className="text-xs">Loading...</span>
      </Badge>
    )
  }

  if (!isConnected || !walletAddress) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Wallet className="w-3 h-3" />
        <span className="text-xs">Not connected</span>
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
