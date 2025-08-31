"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { supabase } from "@/lib/supabase-client"
import { useEffect, useState } from "react"

type TimeRange = "30d" | "90d" | "all"

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
  createdDate: string
}

export function KpiCards() {
  const { currentUser, viewMode } = useAppStore()
  const [debts, setDebts] = useState<Debt[]>([])
  const [timeRange, setTimeRange] = useState<TimeRange>("90d")

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
          payments: debt.payments.map((p: any) => ({
            ...p,
            amount: p.amount_minor / 100,
            date: p.date,
          })),
          createdDate: debt.created_at,
        }
      })

      setDebts(mappedDebts)
    }

    fetchDebts()
  }, [])

  const filterByTimeRange = (date: string) => {
    if (timeRange === "all") return true
    const itemDate = new Date(date)
    const now = new Date()
    const daysAgo = timeRange === "30d" ? 30 : 90
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    return itemDate >= cutoffDate
  }

  // Filter debts based on view mode and time range
  const relevantDebts = debts.filter((debt) => {
    if (!currentUser) return false

    const isRelevant =
      viewMode === "creditor" ? debt.creditorId === currentUser.id : debt.counterpartyId === currentUser.id
    return isRelevant && filterByTimeRange(debt.createdDate)
  })

  // Calculate completion rate
  const completedDebts = relevantDebts.filter((debt) => debt.status === "completed")
  const completionRate = relevantDebts.length > 0 ? Math.round((completedDebts.length / relevantDebts.length) * 100) : 0

  const relevantPayments = relevantDebts.flatMap((debt) =>
    debt.payments
      .filter((payment) => filterByTimeRange(payment.date))
      .map((payment) => ({ ...payment, debtId: debt.id, dueDate: debt.dueDate })),
  )

  const onTimePayments = relevantPayments.filter((payment) => {
    return new Date(payment.date) <= new Date(payment.dueDate)
  })

  const onTimeRate =
    relevantPayments.length > 0 ? Math.round((onTimePayments.length / relevantPayments.length) * 100) : 0

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif font-semibold">Performance Metrics</h2>
        <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="30d" className="text-xs">
              30d
            </TabsTrigger>
            <TabsTrigger value="90d" className="text-xs">
              90d
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TooltipProvider>
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Percentage of debts fully repaid out of all debts created</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-3xl font-bold">{relevantDebts.length > 0 ? `${completionRate}%` : "—"}</div>
                <p className="text-xs text-muted-foreground">
                  {relevantDebts.length > 0
                    ? `${completedDebts.length} of ${relevantDebts.length} debts completed`
                    : "No debts yet"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">On-Time Payment Rate</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Percentage of payments made on or before the debt's due date</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-3xl font-bold">{relevantPayments.length > 0 ? `${onTimeRate}%` : "—"}</div>
                <p className="text-xs text-muted-foreground">
                  {relevantPayments.length > 0
                    ? `${onTimePayments.length} of ${relevantPayments.length} payments on time`
                    : "No payments yet"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TooltipProvider>
      </div>
    </section>
  )
}
