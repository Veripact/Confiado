"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Download } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface DebtDetailHeaderProps {
  debt: {
    id: string
    debtorName: string
    status: string
    dueDate: string
    currency: string
  }
}

export function DebtDetailHeader({ debt }: DebtDetailHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-accent text-accent-foreground"
      case "overdue":
        return "bg-destructive text-destructive-foreground"
      case "completed":
        return "bg-green-600 text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const scrollToExport = () => {
    const exportSection = document.querySelector('section:has(h2:contains("Export Proof"))')
    if (exportSection) {
      exportSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-primary mb-2">{debt.debtorName}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Due: {format(new Date(debt.dueDate), "PPP")}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={scrollToExport} className="bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export Proof
            </Button>
            <Badge className={getStatusColor(debt.status)} variant="outline">
              {debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  )
}
