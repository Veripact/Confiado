"use client"

import type React from "react"
import Web3AuthSignIn from "./web3auth-sign-in"

export function SignInForm() {
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
