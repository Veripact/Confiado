"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard, FileText, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"

interface ConfirmPaymentCardProps {
  payment: {
    id: string
    amount: number
    method: string
    date: string
    note?: string
  }
  currency: string
}

export function ConfirmPaymentCard({ payment, currency }: ConfirmPaymentCardProps) {
  const [status, setStatus] = useState<"pending" | "confirmed" | "rejected">("pending")
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setStatus("confirmed")
  }

  const handleReject = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setStatus("rejected")
  }

  if (status === "confirmed") {
    return (
      <Card className="shadow-sm border-green-200">
        <CardContent className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-2">Payment Confirmed</h3>
          <p className="text-muted-foreground">
            The payment of {currency} {payment.amount.toFixed(2)} has been confirmed and added to the debt record.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (status === "rejected") {
    return (
      <Card className="shadow-sm border-red-200">
        <CardContent className="text-center py-8">
          <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-2">Payment Rejected</h3>
          <p className="text-muted-foreground">
            The payment has been rejected. The debtor has been notified to provide additional verification.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm border-yellow-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Pending Payment Confirmation</CardTitle>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            Awaiting Confirmation
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-2 bg-background rounded-full">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-lg">
                {currency} {payment.amount.toFixed(2)}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  <span>{payment.method}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(payment.date), "PPP")}</span>
                </div>
              </div>
              {payment.note && (
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <FileText className="w-3 h-3" />
                  <span>{payment.note}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          The debtor has logged this payment. Please confirm if you have received this amount.
        </p>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReject} disabled={isLoading} className="flex-1 bg-transparent">
            {isLoading ? "Processing..." : "Reject Payment"}
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading} className="flex-1">
            {isLoading ? "Processing..." : "Confirm Payment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
