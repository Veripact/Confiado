"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ENSInput } from "@/components/ens/ens-input"
import { ENSDisplay } from "@/components/ens/ens-display"
import { Badge } from "@/components/ui/badge"
import { Search, Users, Shield, Globe } from "lucide-react"

export default function ENSPage() {
  const [resolvedAddresses, setResolvedAddresses] = useState<Array<{
    address: string
    ensName?: string
    timestamp: Date
  }>>([])

  const handleAddressResolved = (address: string, ensName?: string) => {
    const newEntry = {
      address,
      ensName,
      timestamp: new Date()
    }
    
    setResolvedAddresses(prev => [newEntry, ...prev.slice(0, 9)]) // Keep last 10
  }

  const clearHistory = () => {
    setResolvedAddresses([])
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">ENS Integration</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Resolve Ethereum Name Service (ENS) names to build trust and improve user experience in Confiado
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Globe className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <CardTitle className="text-lg">Name Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Convert ENS names like alice.eth to Ethereum addresses and vice versa
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <CardTitle className="text-lg">User-Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Use memorable names instead of long wallet addresses for debt management
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <CardTitle className="text-lg">Trust Building</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                ENS names provide additional identity verification for secure transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ENS Resolver */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              ENS Resolver
            </CardTitle>
            <CardDescription>
              Enter an ENS name (like alice.eth) or Ethereum address to resolve
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ENSInput 
              onAddressResolved={handleAddressResolved}
              placeholder="Enter ENS name (alice.eth) or address (0x...)"
            />
          </CardContent>
        </Card>

        {/* Recent Resolutions */}
        {resolvedAddresses.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Resolutions</CardTitle>
                  <CardDescription>
                    Your recent ENS lookups and address resolutions
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={clearHistory}>
                  Clear History
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resolvedAddresses.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <ENSDisplay address={entry.address} />
                    <div className="text-xs text-muted-foreground">
                      {entry.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Integration Info */}
        <Card>
          <CardHeader>
            <CardTitle>ENS in Confiado</CardTitle>
            <CardDescription>
              How ENS enhances the debt management experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge variant="secondary">Feature</Badge>
                  Creditor Identification
                </h4>
                <p className="text-sm text-muted-foreground">
                  When creating debts, users can identify creditors using ENS names instead of complex addresses
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge variant="secondary">Feature</Badge>
                  Profile Display
                </h4>
                <p className="text-sm text-muted-foreground">
                  User profiles show ENS names and avatars when available, building trust and recognition
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge variant="secondary">Feature</Badge>
                  Payment Verification
                </h4>
                <p className="text-sm text-muted-foreground">
                  ENS names help verify payment recipients, reducing errors in debt settlements
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge variant="secondary">Feature</Badge>
                  Social Trust
                </h4>
                <p className="text-sm text-muted-foreground">
                  ENS domains act as digital identity, increasing confidence in peer-to-peer transactions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
