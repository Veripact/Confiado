import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWeb3AuthUser, useWeb3AuthConnect } from "@web3auth/modal/react"

export function useAuthGuard() {
  const router = useRouter()
  const { userInfo, loading: authLoading } = useWeb3AuthUser()
  const { isConnected } = useWeb3AuthConnect()
  const [authCheckComplete, setAuthCheckComplete] = useState(false)

  useEffect(() => {
    console.log('AuthGuard - Current state:', {
      authLoading,
      isConnected,
      hasUserInfo: !!userInfo,
      authCheckComplete
    })

    if (authLoading) {
      // Still loading, don't do anything yet
      console.log('Web3Auth still loading...')
      return
    }

    // Check if we have a valid session (either connected or have userInfo)
    if (isConnected || userInfo) {
      console.log('Web3Auth session detected:', { isConnected, hasUserInfo: !!userInfo })
      setAuthCheckComplete(true)
      return
    }

    // If not connected and no userInfo, wait longer for Web3Auth to restore session
    console.log('Waiting for Web3Auth session restoration...')
    const checkAuthTimeout = setTimeout(() => {
      console.log('AuthGuard - Timeout check:', {
        isConnected,
        hasUserInfo: !!userInfo
      })
      
      if (!isConnected && !userInfo) {
        // After waiting, if still no session, redirect to signin
        console.log('No active Web3Auth session found after extended timeout, redirecting to signin')
        router.replace("/auth/signin")
      } else {
        console.log('Web3Auth session restored successfully:', { isConnected, hasUserInfo: !!userInfo })
        setAuthCheckComplete(true)
      }
    }, 5000) // Increased to 5 seconds for better session restoration

    return () => clearTimeout(checkAuthTimeout)
  }, [authLoading, isConnected, userInfo, router])

  return {
    isAuthenticated: authCheckComplete && (isConnected || !!userInfo),
    isLoading: authLoading || !authCheckComplete,
    userInfo,
  }
}