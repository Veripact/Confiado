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

  // Handle successful sign-in and profile creation
  useEffect(() => {
    const handleUserSignIn = async () => {
      if (isConnected && userInfo) {
        try {
          // Import profile utilities dynamically to avoid SSR issues
          const { getUserProfile, upsertUserProfile } = await import("@/lib/profile")

          // First check if profile already exists
          if (userInfo.email) {
            const existingProfile = await getUserProfile(userInfo.email)

            if (!existingProfile) {
              // Only create profile if it doesn't exist
              const profile = await upsertUserProfile(userInfo)
              if (profile) {
                console.log("User profile created successfully during sign-in")
              } else {
                console.warn("Failed to create user profile during sign-in")
              }
            } else {
              console.log("User profile already exists, skipping creation during sign-in")
            }
          } else {
            console.warn("No email found in userInfo during sign-in, skipping profile creation")
          }

          // Small delay to ensure modal closes
          setTimeout(() => {
            router.replace("/dashboard")
          }, 500)
        } catch (error) {
          console.error("Error handling user profile during sign-in:", error)
          // Still redirect to dashboard even if profile creation fails
          setTimeout(() => {
            router.replace("/dashboard")
          }, 500)
        }
      }
    }

    handleUserSignIn()
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
