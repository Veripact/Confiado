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
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useWeb3AuthUser, useWeb3AuthConnect } from "@web3auth/modal/react"

export default function DashboardPage() {
  const router = useRouter()
  const { userInfo, loading: authLoading } = useWeb3AuthUser()
  const { isConnected } = useWeb3AuthConnect()

  // Protect route with Web3Auth
  useEffect(() => {
    if (!authLoading && !isConnected) {
      router.replace("/auth/signin")
    }
  }, [authLoading, isConnected, router])

  if (authLoading) {
    return <p className="p-10 text-center">Verificando autenticación...</p>
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <ActiveDebts />
        <DebtHistory />
      </main>
    </div>
  )
}
