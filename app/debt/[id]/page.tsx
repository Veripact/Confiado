import { DebtDetailHeader } from "@/components/debt/debt-detail-header"
import { DebtSummary } from "@/components/debt/debt-summary"
import { PaymentHistory } from "@/components/debt/payment-history"
import { PaymentActions } from "@/components/debt/payment-actions"
import { ExportActions } from "@/components/debt/export-actions"
import { notFound } from "next/navigation"

// Mock data - in a real app, this would come from a database
const mockDebtData = {
  "1": {
    id: "1",
    debtorName: "Alice Johnson",
    creditorName: "John Smith",
    total: 2500.0,
    paid: 1000.0,
    remaining: 1500.0,
    status: "active",
    dueDate: "2024-02-15",
    currency: "USD",
    description: "Loan for car repair expenses",
    createdDate: "2024-01-15",
    payments: [
      {
        id: "p1",
        amount: 500.0,
        method: "Bank Transfer",
        date: "2024-01-20",
        status: "confirmed" as "confirmed",
        note: "First installment payment",
      },
      {
        id: "p2",
        amount: 500.0,
        method: "Cash",
        date: "2024-01-25",
        status: "confirmed" as "confirmed",
        note: "Second payment",
      },
      {
        id: "p3",
        amount: 300.0,
        method: "PayPal",
        date: "2024-02-01",
        status: "pending" as "pending",
        note: "Partial payment",
      },
    ],
  },
  "2": {
    id: "2",
    debtorName: "Bob Smith",
    creditorName: "John Smith",
    total: 5000.0,
    paid: 3000.0,
    remaining: 2000.0,
    status: "overdue",
    dueDate: "2024-01-30",
    currency: "USD",
    description: "Personal loan",
    createdDate: "2024-01-10",
    payments: [
      {
        id: "p4",
        amount: 1500.0,
        method: "Bank Transfer",
        date: "2024-01-15",
        status: "confirmed" as "confirmed",
        note: "Initial payment",
      },
      {
        id: "p5",
        amount: 1500.0,
        method: "Check",
        date: "2024-01-25",
        status: "confirmed" as "confirmed",
        note: "Second installment",
      },
    ],
  },
  "3": {
    id: "3",
    creditorName: "John Doe",
    debtorName: "Carol Davis",
    debtorContact: "carol@example.com",
    total: 1200.0,
    paid: 1200.0,
    remaining: 0.0,
    status: "active",
    dueDate: "2024-03-01",
    createdDate: "2024-01-10",
    currency: "USD",
    description: "Emergency loan",
    payments: [
      {
        id: "6",
        amount: 400.0,
        method: "Cash",
        date: "2024-01-20",
        status: "confirmed" as "confirmed",
      },
      {
        id: "7",
        amount: 400.0,
        method: "Bank Transfer",
        date: "2024-02-01",
        status: "confirmed" as "confirmed",
      },
      {
        id: "8",
        amount: 400.0,
        method: "Credit Card",
        date: "2024-02-15",
        status: "confirmed" as "confirmed",
      }
    ],
  },
}

interface DebtDetailPageProps {
  params: {
    id: string
  }
}

export default async function DebtDetailPage({ params }: DebtDetailPageProps) {
  const { id } = await params
  const debt = mockDebtData[id as keyof typeof mockDebtData]

  if (!debt) {
    notFound()
  }

  // Mock user role - in a real app, this would come from authentication
  const userRole = "creditor" // or "debtor"
  const currentUser = userRole === "creditor" ? debt.creditorName : debt.debtorName

  return (
    <div className="min-h-screen bg-background">
      <DebtDetailHeader debt={debt} />

      <main className="container mx-auto px-4 py-6 space-y-8">
        <DebtSummary debt={debt} />
        <PaymentHistory payments={debt.payments} />
        <PaymentActions debt={debt} userRole={userRole} />
        <ExportActions debt={debt} />
      </main>
    </div>
  )
}
