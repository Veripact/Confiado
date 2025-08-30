"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useState } from "react"

type TimeRange = "30d" | "90d" | "all"

export function KpiCards() {
  const { debts, currentUser, viewMode } = useAppStore()
  const [timeRange, setTimeRange] = useState<TimeRange>("90d")

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
    const isRelevant =
      viewMode === "creditor" ? debt.creditorName === currentUser.name : debt.debtorName === currentUser.name
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
