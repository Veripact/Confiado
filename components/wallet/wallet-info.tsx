"use client"

import { useState, useEffect } from "react"
import { useWeb3AuthUser, useWeb3AuthConnect } from "@web3auth/modal/react"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WalletInfo() {
  const { userInfo } = useWeb3AuthUser()
  const { provider } = useWeb3AuthConnect()
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [balance, setBalance] = useState<string>("0.00")
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const getWalletInfo = async () => {
      if (!provider || !userInfo) {
        setLoading(false)
        return
      }

      try {
        // Get wallet address from Web3Auth provider
        const accounts = await provider.request({ method: "eth_accounts" })
        console.log("Web3Auth accounts:", accounts)
        console.log("UserInfo:", userInfo)
        
        if (accounts && accounts.length > 0) {
          const address = accounts[0]
          setWalletAddress(address)
          
          // Get balance
          const balanceHex = await provider.request({
            method: "eth_getBalance",
            params: [address, "latest"]
          })
          const balanceWei = parseInt(balanceHex, 16)
          const balanceEth = (balanceWei / 1e18).toFixed(4)
          setBalance(balanceEth)
        } else {
          console.log("No accounts found, userInfo:", userInfo)
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
  }, [provider, userInfo])

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
