"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, User } from "lucide-react"
import Link from "next/link"
import { useAppStore } from "@/lib/store"

export function DebtHistory() {
  const { debts, viewMode, currentUser } = useAppStore()

  const completedDebts = debts.filter((debt) => {
    const isCompleted = debt.status === "completed"
    if (viewMode === "creditor") {
      return isCompleted && debt.creditorName === currentUser.name
    } else {
      return isCompleted && debt.debtorName === currentUser.name
    }
  })

  return (
    <section>
      <h2 className="text-xl font-serif font-semibold mb-4">Recent History</h2>

      {completedDebts.length === 0 ? (
        <Alert>
          <AlertDescription>
            {viewMode === "creditor" ? "No completed debts yet." : "No completed debts in your history."}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-3">
          {completedDebts.map((debt) => (
            <Card key={debt.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <Link href={`/debt/${debt.id}`}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {viewMode === "creditor" ? debt.debtorName : debt.creditorName}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Completed on {new Date(debt.createdDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">${debt.total.toFixed(2)}</p>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Paid in Full
                      </Badge>
                    </div>
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
