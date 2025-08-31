import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation"
import { Web3AuthBridgeContext } from "@/components/providers"

export function useAuthGuard() {
  const router = useRouter()
  const [authCheckComplete, setAuthCheckComplete] = useState(false)
  const [web3AuthError, setWeb3AuthError] = useState<string | null>(null)

  // Use the bridge context (consumes @web3auth hooks inside the provider)
  const bridge = useContext(Web3AuthBridgeContext)
  const userInfo = bridge?.userInfo || null
  const isConnected = !!bridge?.isConnected
  const authLoading = !!bridge?.loading

  useEffect(() => {
    // If the bridge is not available (i.e. provider not mounted), wait and then error
    if (!bridge) {
      console.log('Web3Auth bridge not available yet, waiting...')
      const t = setTimeout(() => {
        if (!bridge) {
          setWeb3AuthError('Web3Auth provider not available')
          setAuthCheckComplete(true)
        }
      }, 2000)
      return () => clearTimeout(t)
    }

    // If bridge indicates loading, do nothing here - allow bridge to finish
    if (authLoading) return

    // If bridge is ready but no userInfo, mark check complete (will trigger redirect later)
    if (!authLoading && !userInfo) {
      setAuthCheckComplete(true)
    }
  }, [bridge, authLoading, userInfo])

  useEffect(() => {
    if (authLoading) {
      console.log('⏳ Web3Auth still loading...')
      return
    }

    const isAuthenticated = !!userInfo

    if (isAuthenticated) {
      console.log('✅ Web3Auth session detected via bridge:', { hasUserInfo: !!userInfo, isConnected })
      setAuthCheckComplete(true)
      return
    }

    // If not authenticated, wait longer for session restoration then redirect
    const checkAuthTimeout = setTimeout(() => {
      if (!userInfo) {
        console.log('❌ No active Web3Auth session found after extended timeout, redirecting to signin')
        router.replace('/auth/signin')
      } else {
        setAuthCheckComplete(true)
      }
    }, 8000)

    return () => clearTimeout(checkAuthTimeout)
  }, [authLoading, isConnected, userInfo, router])

  const isAuthenticated = authCheckComplete && !!userInfo

  return {
    isAuthenticated,
    isLoading: authLoading || !authCheckComplete,
    userInfo,
    error: web3AuthError
  }
}