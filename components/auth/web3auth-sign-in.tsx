"use client";

import React, { useEffect } from "react";
import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { useWeb3AuthUser } from "@web3auth/modal/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Web3AuthSignIn: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { connect, isConnected } = useWeb3AuthConnect();
  const { userInfo } = useWeb3AuthUser();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Handle successful login and profile creation
  useEffect(() => {
    const handleUserLogin = async () => {
      if (isConnected && userInfo) {
        try {
          // Import profile utilities dynamically to avoid SSR issues
          const { getUserProfile, upsertUserProfile } = await import("@/lib/profile");

          // First check if profile already exists
          if (userInfo.email) {
            const existingProfile = await getUserProfile(userInfo.email);

            if (!existingProfile) {
              // Only create profile if it doesn't exist
              const profile = await upsertUserProfile(userInfo);
              if (profile) {
                console.log("User profile created successfully");
              } else {
                console.warn("Failed to create user profile");
              }
            } else {
              console.log("User profile already exists, skipping creation");
            }
          } else {
            console.warn("No email found in userInfo, skipping profile creation");
          }
        } catch (error) {
          console.error("Error handling user profile:", error);
        }

        // Redirect to dashboard
        router.replace("/dashboard");
      }
    };

    handleUserLogin();
  }, [isConnected, userInfo, router]);

  return (
    <Button
      onClick={handleSignIn}
      className={`w-full ${className}`}
      disabled={false}
    >
      Connect with Web3Auth
    </Button>
  );
};

export default Web3AuthSignIn;
