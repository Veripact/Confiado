"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Plus, Settings, User, LogOut, Wallet } from "lucide-react"
import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useWeb3AuthUser, useWeb3AuthDisconnect } from "@web3auth/modal/react"
import { WalletInfo } from "@/components/wallet/wallet-info"

export function DashboardHeader() {
  const { viewMode, setViewMode } = useAppStore()
  const router = useRouter()
  const { userInfo } = useWeb3AuthUser()
  const { disconnect } = useWeb3AuthDisconnect()

  const handleLogout = async () => {
    try {
      await disconnect()
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-serif font-bold text-primary">Confiado</h1>
            <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "creditor" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("creditor")}
                className="text-xs"
              >
                Creditor
              </Button>
              <Button
                variant={viewMode === "debtor" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("debtor")}
                className="text-xs"
              >
                Debtor
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <WalletInfo />
            {viewMode === "creditor" && (
              <Button asChild size="sm" className="hidden sm:flex">
                <Link href="/debt/create">
                  <Plus className="w-4 h-4 mr-2" />
                  New Debt
                </Link>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userInfo?.profileImage || "/placeholder.svg"} alt={userInfo?.name || "User"} />
                    <AvatarFallback>
                      {userInfo?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userInfo?.name || "Usuario"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userInfo?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="sm:hidden px-2 py-1">
                  <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                    <Button
                      variant={viewMode === "creditor" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("creditor")}
                      className="text-xs flex-1"
                    >
                      Creditor
                    </Button>
                    <Button
                      variant={viewMode === "debtor" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("debtor")}
                      className="text-xs flex-1"
                    >
                      Debtor
                    </Button>
                  </div>
                </div>
                <DropdownMenuSeparator className="sm:hidden" />
                {viewMode === "creditor" && (
                  <DropdownMenuItem className="sm:hidden" onClick={() => router.push("/debt/create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Debt
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
