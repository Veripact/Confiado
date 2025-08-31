import { DebtDetailHeader } from "@/components/debt/debt-detail-header"
import { DebtSummary } from "@/components/debt/debt-summary"
import { PaymentHistory } from "@/components/debt/payment-history"
import { PaymentActions } from "@/components/debt/payment-actions"
import { ExportActions } from "@/components/debt/export-actions"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"

// Types for the data
interface DebtDB {
  id: string;
  creditor_id: string;
  counterparty_id: string;
  amount_minor: number;
  currency: string;
  due_date: string | null;
  description: string | null;
  status: string;
  created_at: string;
  creditor_name: string;
  counterparty_name: string;
}

interface PaymentDB {
  id: string;
  debt_id: string;
  amount_minor: number;
  method: string;
  date: string;
  note: string | null;
  status: string;
  creditor_confirmed_at: string | null;
  created_at: string;
}

interface DebtDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DebtDetailPage({ params }: DebtDetailPageProps) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: debt, error } = await supabase
    .from('debts')
    .select(`
      *,
      creditor:profiles!debts_creditor_id_fkey(name),
      counterparty:profiles!debts_counterparty_id_fkey(name)
    `)
    .eq('id', id)
    .single()

  if (error || !debt) {
    notFound()
  }

  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('debt_id', id)
    .order('date', { ascending: false })

  // Calculate total, paid, remaining
  const total = debt.amount_minor / 100
  const paid = (payments || []).reduce((sum, p) => sum + (p.amount_minor / 100), 0)
  const remaining = total - paid

  const mappedPayments = (payments || []).map(p => ({
    id: p.id,
    amount: p.amount_minor / 100,
    method: p.method,
    date: p.date,
    status: p.status,
    note: p.note || '',
  }))

  // Map to component expected format
  const mappedDebt = {
    id: debt.id,
    debtorName: debt.counterparty?.name || 'Unknown',
    creditorName: debt.creditor?.name || 'Unknown',
    total,
    paid,
    remaining,
    status: debt.status,
    dueDate: debt.due_date || '',
    currency: debt.currency,
    description: debt.description || '',
    createdDate: debt.created_at,
    payments: mappedPayments,
  }

  // Mock user role - in a real app, this would come from authentication
  const userRole = "creditor" // or "debtor"
  const currentUser = userRole === "creditor" ? mappedDebt.creditorName : mappedDebt.debtorName

  return (
    <div className="min-h-screen bg-background">
      <DebtDetailHeader debt={mappedDebt} />

      <main className="container mx-auto px-4 py-6 space-y-8">
        <DebtSummary debt={mappedDebt} />
        <PaymentHistory payments={mappedPayments} />
        <PaymentActions debt={mappedDebt} userRole={userRole} />
        <ExportActions debt={mappedDebt} />
      </main>
    </div>
  )
}
