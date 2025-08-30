import { ConfirmDebtCard } from "@/components/debt/confirm-debt-card"
import { notFound } from "next/navigation"

// Mock data - in a real app, this would come from a database
const mockDebtData = {
  "1": {
    id: "1",
    creditorName: "John Smith",
    creditorEmail: "john.smith@example.com",
    amount: 2500.0,
    currency: "USD",
    dueDate: "2024-02-15",
    description: "Loan for car repair expenses",
    createdDate: "2024-01-15",
  },
  "2": {
    id: "2",
    creditorName: "Sarah Johnson",
    creditorEmail: "sarah.j@example.com",
    amount: 1200.0,
    currency: "USD",
    dueDate: "2024-03-01",
    description: "Personal loan for emergency expenses",
    createdDate: "2024-01-20",
  },
}

interface ConfirmDebtPageProps {
  params: {
    id: string
  }
}

export default function ConfirmDebtPage({ params }: ConfirmDebtPageProps) {
  const debt = mockDebtData[params.id as keyof typeof mockDebtData]

  if (!debt) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">Confiado</h1>
            <p className="text-muted-foreground">Debt Agreement Confirmation</p>
          </div>

          <ConfirmDebtCard debt={debt} />
        </div>
      </div>
    </div>
  )
}
