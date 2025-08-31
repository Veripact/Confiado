"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Clock } from "lucide-react"
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

export function SummaryCards() {
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

  const relevantDebts = debts.filter((debt) => {
    if (!currentUser) return false

    if (viewMode === "creditor") {
      return debt.creditorId === currentUser.id
    } else {
      return debt.counterpartyId === currentUser.id
    }
  })

  const totalOwed = relevantDebts.reduce((sum, debt) => sum + debt.total, 0)
  const totalPaid = relevantDebts.reduce((sum, debt) => sum + debt.paid, 0)
  const totalRemaining = relevantDebts.reduce((sum, debt) => sum + debt.remaining, 0)

  const summaryData = [
    {
      title: viewMode === "creditor" ? "Total Owed" : "Total You Owe",
      value: `$${totalOwed.toFixed(2)}`,
      icon: DollarSign,
      description: viewMode === "creditor" ? "Across all active debts" : "Your total debt amount",
    },
    {
      title: "Paid",
      value: `$${totalPaid.toFixed(2)}`,
      icon: TrendingUp,
      description: viewMode === "creditor" ? "Total payments received" : "Total you've paid",
    },
    {
      title: "Remaining",
      value: `$${totalRemaining.toFixed(2)}`,
      icon: Clock,
      description: "Outstanding balance",
    },
  ]

  return (
    <section>
      <h2 className="text-xl font-serif font-semibold mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryData.map((item) => (
          <Card key={item.title} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{item.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
