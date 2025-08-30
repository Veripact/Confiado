import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { ActiveDebts } from "@/components/dashboard/active-debts"
import { DebtHistory } from "@/components/dashboard/debt-history"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-8">
        <SummaryCards />
        <KpiCards />
        <ActiveDebts />
        <DebtHistory />
      </main>
    </div>
  )
}
