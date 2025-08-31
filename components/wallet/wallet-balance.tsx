"use client"

import { useState, useEffect } from "react"
import { useWeb3AuthUser } from "@web3auth/modal/react"
import { Badge } from "@/components/ui/badge"
import { Wallet, DollarSign } from "lucide-react"

export function WalletBalance() {
  const { userInfo } = useWeb3AuthUser()
  const [balance, setBalance] = useState<string>("0.00")
  const [usdcBalance, setUsdcBalance] = useState<string>("0.00")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBalance = async () => {
      if (!userInfo?.dappShare) {
        setLoading(false)
        return
      }

      try {
        // Simulate balance fetch - replace with actual RPC call
        // For now, showing mock data
        setBalance("0.0025")
        setUsdcBalance("10.50")
        setLoading(false)
      } catch (error) {
        console.error("Error fetching balance:", error)
        setLoading(false)
      }
    }

    fetchBalance()
  }, [userInfo])

  if (!userInfo?.dappShare) return null

  return (
    <div className="flex items-center gap-3">
      <Badge variant="outline" className="flex items-center gap-1">
        <Wallet className="w-3 h-3" />
        <span className="font-mono text-xs">
          {loading ? "..." : `${balance} ETH`}
        </span>
      </Badge>
      <Badge variant="secondary" className="flex items-center gap-1">
        <DollarSign className="w-3 h-3" />
        <span className="font-mono text-xs">
          {loading ? "..." : `${usdcBalance} USDC`}
        </span>
      </Badge>
    </div>
  )
}
