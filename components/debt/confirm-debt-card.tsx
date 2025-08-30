"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Calendar, DollarSign, User, Mail, FileText, AlertTriangle } from "lucide-react"
import { format } from "date-fns"

interface DebtData {
  id: string
  creditorName: string
  creditorEmail: string
  amount: number
  currency: string
  dueDate: string
  description?: string
  createdDate: string
}

interface ConfirmDebtCardProps {
  debt: DebtData
}

export function ConfirmDebtCard({ debt }: ConfirmDebtCardProps) {
  const [status, setStatus] = useState<"pending" | "accepted" | "rejected">("pending")
  const [isLoading, setIsLoading] = useState(false)

  const handleAccept = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setStatus("accepted")
  }

  const handleReject = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setStatus("rejected")
  }

  if (status === "accepted") {
    return (
      <Card className="shadow-lg">
        <CardContent className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-primary mb-2">Agreement Accepted</h2>
          <p className="text-muted-foreground mb-6">
            You have successfully accepted the debt agreement. Both parties will receive a confirmation email with the
            agreement details.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Next Steps:</strong> You can now track payments and communicate with {debt.creditorName} through
              the Confiado platform. You'll receive reminders as the due date approaches.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === "rejected") {
    return (
      <Card className="shadow-lg">
        <CardContent className="text-center py-12">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-primary mb-2">Agreement Rejected</h2>
          <p className="text-muted-foreground mb-6">
            You have rejected this debt agreement. The creditor has been notified of your decision.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              If you believe this was sent in error or would like to discuss the terms, please contact{" "}
              {debt.creditorName} directly at {debt.creditorEmail}.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-serif">Debt Agreement Review</CardTitle>
        <CardDescription>Please review the following debt agreement details carefully</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            By accepting this agreement, you acknowledge the debt and agree to the specified terms and due date.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <User className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Creditor</p>
              <p className="text-sm text-muted-foreground">{debt.creditorName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Contact</p>
              <p className="text-sm text-muted-foreground">{debt.creditorEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <DollarSign className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Amount</p>
              <p className="text-lg font-bold text-primary">
                {debt.currency} {debt.amount.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Due Date</p>
              <p className="text-sm text-muted-foreground">{format(new Date(debt.dueDate), "PPP")}</p>
            </div>
          </div>

          {debt.description && (
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Description</p>
                <p className="text-sm text-muted-foreground">{debt.description}</p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Agreement Summary</h3>
          <div className="text-sm space-y-1">
            <p>
              I, the debtor, acknowledge that I owe <strong>{debt.creditorName}</strong> the amount of{" "}
              <strong>
                {debt.currency} {debt.amount.toFixed(2)}
              </strong>{" "}
              to be paid by <strong>{format(new Date(debt.dueDate), "PPP")}</strong>.
            </p>
            <p className="text-muted-foreground mt-2">
              Agreement created on {format(new Date(debt.createdDate), "PPP")}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleReject} variant="outline" className="flex-1 bg-transparent" disabled={isLoading}>
            {isLoading ? "Processing..." : "Reject Agreement"}
          </Button>
          <Button onClick={handleAccept} className="flex-1" disabled={isLoading}>
            {isLoading ? "Processing..." : "Accept Agreement"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          By clicking "Accept Agreement", you agree to the terms outlined above and acknowledge the debt obligation.
        </p>
      </CardContent>
    </Card>
  )
}
