"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, User, Plus } from "lucide-react"
import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { supabase } from "@/lib/supabase-client"
import { useEffect, useState } from "react"

interface Debt {
  id: string
  creditorId: string
  counterpartyId: string
  creditorName: string
  debtorName: string
  total: number
  paid: number
  remaining: number
  status: string
  dueDate: string
  currency: string
  description?: string
  payments: any[]
}

export function ActiveDebts() {
  const { viewMode, currentUser } = useAppStore()
  const [debts, setDebts] = useState<Debt[]>([])

  useEffect(() => {
    const fetchDebts = async () => {
      const { data, error } = await supabase
        .from('debts')
        .select(`
          *,
          creditor:profiles!debts_creditor_id_fkey(id, name),
          counterparty:profiles!debts_counterparty_id_fkey(id, name),
          payments(*)
        `)

      if (error) {
        console.error('Error fetching debts:', error)
        return
      }

      const mappedDebts = data.map((debt: any) => {
        const total = debt.amount_minor / 100
        const paid = debt.payments
          .filter((p: any) => p.status === 'confirmed')
          .reduce((sum: number, p: any) => sum + p.amount_minor / 100, 0)
        const remaining = total - paid

        return {
          id: debt.id,
          creditorId: debt.creditor?.id,
          counterpartyId: debt.counterparty?.id,
          creditorName: debt.creditor?.name || 'Unknown',
          debtorName: debt.counterparty?.name || 'Unknown',
          total,
          paid,
          remaining,
          status: debt.status,
          dueDate: debt.due_date || '',
          currency: debt.currency,
          description: debt.description,
          payments: debt.payments,
        }
      })

      setDebts(mappedDebts)
    }

    fetchDebts()
  }, [])

  const activeDebts = debts.filter((debt) => {
    if (!currentUser) return false

    const isActive = debt.status === "active" || debt.status === "overdue"
    if (viewMode === "creditor") {
      return isActive && debt.creditorId === currentUser.id
    } else {
      return isActive && debt.counterpartyId === currentUser.id
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-accent text-accent-foreground"
      case "overdue":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif font-semibold">
          {viewMode === "creditor" ? "Active Debts" : "Debts You Owe"}
        </h2>
        {viewMode === "creditor" && (
          <Button asChild variant="outline" size="sm">
            <Link href="/debt/create">
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Link>
          </Button>
        )}
      </div>

      {activeDebts.length === 0 ? (
        <Alert>
          <AlertDescription>
            {viewMode === "creditor"
              ? "No active debts found. Create a new debt to get started."
              : "You don't have any active debts."}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {activeDebts.map((debt) => (
            <Card key={debt.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <Link href={`/debt/${debt.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {viewMode === "creditor" ? debt.debtorName : debt.creditorName}
                    </CardTitle>
                    <Badge className={getStatusColor(debt.status)}>
                      {debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-semibold">${debt.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Paid</p>
                      <p className="font-semibold text-green-600">${debt.paid.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Remaining</p>
                      <p className="font-semibold text-orange-600">${debt.remaining.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(debt.dueDate).toLocaleDateString()}</span>
                  </div>

                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all"
                      style={{ width: `${(debt.paid / debt.total) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
