"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWeb3AuthConnect } from "@web3auth/modal/react"
import { useWeb3AuthUser } from "@web3auth/modal/react"
import Web3AuthSignIn from "./web3auth-sign-in"

export function SignInForm() {
  const router = useRouter()
  const { isConnected } = useWeb3AuthConnect()
  const { userInfo } = useWeb3AuthUser()

  // Redirect to dashboard if already connected
  useEffect(() => {
    if (isConnected && userInfo) {
      // Small delay to ensure modal closes
      setTimeout(() => {
        router.replace("/dashboard")
      }, 500)
    }
  }, [isConnected, userInfo, router])

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
      <h2 className="text-lg font-semibold">Connect your wallet</h2>
      <p className="text-sm text-muted-foreground">
        Use Web3Auth to securely access your account
      </p>
      </div>
      <Web3AuthSignIn />
    </div>
  )
}
