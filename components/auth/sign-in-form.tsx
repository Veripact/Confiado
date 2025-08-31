"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWeb3AuthConnect } from "@web3auth/modal/react"
import Web3AuthSignIn from "./web3auth-sign-in"

export function SignInForm() {
  const router = useRouter()
  const { isConnected, loading } = useWeb3AuthConnect()

  // Redirect to dashboard if already connected
  useEffect(() => {
    if (isConnected) {
      router.replace("/dashboard")
    }
  }, [isConnected, router])

  if (loading) {
    return <p className="p-10 text-center">Cargando autenticación...</p>
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-lg font-semibold">Conecta tu wallet</h2>
        <p className="text-sm text-muted-foreground">
          Usa Web3Auth para acceder de forma segura a tu cuenta
        </p>
      </div>
      <Web3AuthSignIn />
    </div>
  )
}
