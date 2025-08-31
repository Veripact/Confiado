"use client";

import React, { useEffect, useState, useContext } from "react";
import { Web3AuthBridgeContext } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Web3AuthSignIn: React.FC<{ className?: string }> = ({ className = "" }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the bridge context provided by components/providers.tsx
  const bridge = useContext(Web3AuthBridgeContext);
  const { connect, isConnected, loading: connectLoading, userInfo, loading: userLoading } = {
    connect: bridge?.connect,
    isConnected: bridge?.isConnected ?? false,
    loading: bridge?.loading ?? false,
    userInfo: bridge?.userInfo ?? null,
    // alias userLoading to the same bridge.loading
    loadingUser: bridge?.loading ?? false,
  } as any;

  // Check if Web3Auth bridge is available
  const isWeb3AuthAvailable = !!bridge;

  if (!isWeb3AuthAvailable) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 text-sm">Authentication service unavailable</p>
        <Button
          onClick={() => window.location.reload()}
          className={`w-full mt-2 ${className}`}
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }

  const handleSignIn = async () => {
    if (!connect) {
      setError("Authentication service not available");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await connect();
    } catch (error) {
      console.error("Login failed:", error);
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful login and profile creation
  useEffect(() => {
    const handleUserLogin = async () => {
      if (isConnected && userInfo && !userLoading) {
        console.log('🔐 Web3Auth login successful:', {
          isConnected,
          hasUserInfo: !!userInfo,
          userEmail: (userInfo as any)?.email,
          userName: (userInfo as any)?.name,
          timestamp: new Date().toISOString()
        })

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
                console.log("User profile created successfully")
              } else {
                console.warn("Failed to create user profile")
              }
            } else {
              console.log("User profile already exists, skipping creation")
            }
          } else {
            console.warn("No email found in userInfo, skipping profile creation")
          }
        } catch (error) {
          console.error("Error handling user profile:", error)
          // Don't block redirect if profile creation fails
        }

        // Redirect to dashboard
        console.log('🚀 Redirecting to dashboard after successful login')
        router.replace("/dashboard")
      }
    }

    if (isConnected && userInfo) {
      handleUserLogin()
    }
  }, [isConnected, userInfo, userLoading, router])

  const isButtonLoading = isLoading || connectLoading;

  return (
    <div className="space-y-2">
      <Button
        onClick={handleSignIn}
        className={`w-full ${className}`}
        disabled={isButtonLoading}
      >
        {isButtonLoading ? "Connecting..." : "Connect with Web3Auth"}
      </Button>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
    </div>
  );
};

export default Web3AuthSignIn;
