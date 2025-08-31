"use client"

import { useState, useEffect } from "react"
import { useWeb3AuthUser } from "@web3auth/modal/react"
import { Badge } from "@/components/ui/badge"
import { Wallet, DollarSign } from "lucide-react"

export function WalletBalance() {
  const [balance, setBalance] = useState<string>("0.00")
  const [usdcBalance, setUsdcBalance] = useState<string>("0.00")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Always call hooks at the top level - React Rules of Hooks
  // Never wrap hook calls in try-catch blocks
  const userResult = useWeb3AuthUser()

  const { userInfo, loading: userLoading } = userResult || { userInfo: null, loading: false }

  // Check if Web3Auth is available
  const isWeb3AuthAvailable = userResult;

  if (!isWeb3AuthAvailable) {
    return null
  }

  useEffect(() => {
    const fetchBalance = async () => {
      if (!userInfo?.dappShare) {
        setLoading(false)
        return
      }

      try {
        setError(null)
        // Simulate balance fetch - replace with actual RPC call
        // For now, showing mock data
        setBalance("0.0025")
        setUsdcBalance("10.50")
        setLoading(false)
      } catch (error) {
        console.error("Error fetching balance:", error)
        setError('Failed to load balance')
        setLoading(false)
      }
    }

    fetchBalance()
  }, [userInfo])

  if (error || !userInfo?.dappShare) return null

  return (
    <div className="flex items-center gap-3">
      <Badge variant="outline" className="flex items-center gap-1">
        <Wallet className="w-3 h-3" />
        <span className="font-mono text-xs">
          {loading || userLoading ? "..." : `${balance} ETH`}
        </span>
      </Badge>
      <Badge variant="secondary" className="flex items-center gap-1">
        <DollarSign className="w-3 h-3" />
        <span className="font-mono text-xs">
          {loading || userLoading ? "..." : `${usdcBalance} USDC`}
        </span>
      </Badge>
    </div>
  )
}
