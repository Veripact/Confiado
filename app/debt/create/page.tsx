import { CreateDebtForm } from "@/components/debt/create-debt-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateDebtPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-serif">Create New Debt</CardTitle>
                <CardDescription>Set up a new debt agreement with clear terms and payment tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <CreateDebtForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
