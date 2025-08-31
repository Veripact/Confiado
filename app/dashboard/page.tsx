"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActiveDebts } from "@/components/dashboard/active-debts"
import { DebtHistory } from "@/components/dashboard/debt-history"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileNotification } from "@/components/dashboard/profile-notification"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { getMissingProfileInfo, getUserProfile } from "@/lib/profile"
import { useAppStore } from "@/lib/store"

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, userInfo } = useAuthGuard()
  const [missingInfo, setMissingInfo] = useState<string[]>([])
  const { setCurrentUser } = useAppStore()

  // Set current user from profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (userInfo?.email) {
        const profile = await getUserProfile(userInfo.email)
        if (profile) {
          setCurrentUser({
            id: profile.id || userInfo.email, // Fallback to email if no profile ID
            name: profile.name || userInfo.name || 'Unknown User',
            email: profile.email || userInfo.email,
            phone: profile.phone_e164 || undefined,
            avatar: userInfo.profileImage || '/placeholder.svg',
            ensLabel: profile.ens_label || undefined,
          })
        } else {
          // If no profile exists, don't create one automatically
          // Let the user set up their profile through the profile page
          console.log('No profile found - user should complete profile setup')
          setCurrentUser({
            id: userInfo.email, // Use email as temporary ID
            name: userInfo.name || 'Unknown User',
            email: userInfo.email,
            avatar: userInfo.profileImage || '/placeholder.svg',
          })
        }
      }
    }

    if (isAuthenticated && userInfo && !isLoading) {
      loadUserProfile()
    }
  }, [isAuthenticated, userInfo, isLoading, setCurrentUser])

  // Check for missing profile information
  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (userInfo?.email) {
        const missing = await getMissingProfileInfo(userInfo.email)
        setMissingInfo(missing)
      }
    }

    if (isAuthenticated && userInfo) {
      checkProfileCompletion()
    }
  }, [isAuthenticated, userInfo])

  // Show loading while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <div className="text-center">
            <p className="text-muted-foreground">Restoring your session...</p>
            <p className="text-sm text-muted-foreground mt-2">
              This may take a few moments
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null // The useAuthGuard hook handles the redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-8">
        <ProfileNotification missingInfo={missingInfo} />
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <SummaryCards />
        <KpiCards />
        <ActiveDebts />
        <DebtHistory />
      </main>
    </div>
  )
}
