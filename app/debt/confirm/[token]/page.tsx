import { Suspense } from 'react'
import { DebtConfirmationPage } from '../../../../components/debt/debt-confirmation-page'

interface PageProps {
  params: Promise<{
    token: string
  }>
}

export default async function ConfirmDebtPage({ params }: PageProps) {
  const { token } = await params

  // Basic token validation
  if (!token || token.length < 10) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Invalid Link</h1>
          <p className="text-muted-foreground">The confirmation link is invalid or malformed.</p>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading confirmation...</p>
        </div>
      </div>
    }>
      <DebtConfirmationPage token={token} />
    </Suspense>
  )
}
