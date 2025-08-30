"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogPaymentModal } from "./log-payment-modal"
import { ConfirmPaymentCard } from "./confirm-payment-card"
import { Plus } from "lucide-react"

interface PaymentActionsProps {
  debt: {
    id: string
    remaining: number
    currency: string
  }
  userRole: "creditor" | "debtor"
}

export function PaymentActions({ debt, userRole }: PaymentActionsProps) {
  const [isLogPaymentOpen, setIsLogPaymentOpen] = useState(false)

  // Mock pending payment for creditor view
  const pendingPayment = {
    id: "p3",
    amount: 300.0,
    method: "PayPal",
    date: "2024-02-01",
    note: "Partial payment",
  }

  if (userRole === "debtor") {
    return (
      <section>
        <h2 className="text-xl font-serif font-semibold mb-4">Payment Actions</h2>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Log a Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Record a payment you've made to keep track of your debt progress.
            </p>
            <Button onClick={() => setIsLogPaymentOpen(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Log Payment
            </Button>
          </CardContent>
        </Card>

        <LogPaymentModal isOpen={isLogPaymentOpen} onClose={() => setIsLogPaymentOpen(false)} debt={debt} />
      </section>
    )
  }

  // Creditor view
  return (
    <section>
      <h2 className="text-xl font-serif font-semibold mb-4">Payment Confirmations</h2>

      <ConfirmPaymentCard payment={pendingPayment} currency={debt.currency} />
    </section>
  )
}
