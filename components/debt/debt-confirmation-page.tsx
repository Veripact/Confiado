'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import { getDebtConfirmationByToken, updateDebtConfirmationStatus } from '@/lib/debt-confirmations'

interface DebtConfirmationPageProps {
  token: string
}

interface ConfirmationData {
  id: string
  token: string
  status: string
  expires_at: string
  debt_id: string
  debts: {
    id: string
    amount_minor: number
    currency: string
    due_date: string
    description?: string
    creditor_id: string
    counterparty_id: string
    profiles: {
      name?: string
      email?: string
    }
    counterparty: {
      name?: string
      email?: string
      phone_e164?: string
    }
  } | null
}

export function DebtConfirmationPage({ token }: DebtConfirmationPageProps) {
  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchConfirmation = async () => {
      try {
        console.log('Fetching confirmation for token:', token)
        const data = await getDebtConfirmationByToken(token)
        console.log('Confirmation data:', data)

        if (!data) {
          setError('Invalid or expired confirmation link')
        } else {
          setConfirmation(data)
        }
      } catch (err) {
        console.error('Error fetching confirmation:', err)
        setError('Failed to load confirmation details')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchConfirmation()
    }
  }, [token])

  const handleResponse = async (status: 'accepted' | 'rejected') => {
    console.log('🎯 handleResponse called with status:', status)
    console.log('🎯 Current confirmation state:', confirmation)
    console.log('🎯 Current token:', token)

    if (!token) {
      console.log('❌ No token provided')
      setError('Invalid confirmation token')
      return
    }

    setProcessing(true)
    try {
      console.log('🔄 Calling updateDebtConfirmationStatus...')
      const success = await updateDebtConfirmationStatus(token, status)
      console.log('🔄 updateDebtConfirmationStatus result:', success)

      if (success) {
        console.log('✅ Update successful, updating local state...')
        console.log('✅ Previous confirmation:', confirmation)
        setConfirmation((prev) => {
          console.log('✅ setConfirmation callback, prev:', prev)
          const newState = prev ? { ...prev, status } : null
          console.log('✅ New confirmation state:', newState)
          return newState
        })
      } else {
        console.log('❌ Update failed - checking for network issues...')
        // Check if it's a network error
        if (!navigator.onLine) {
          setError('Network connection lost. Please check your internet connection and try again.')
        } else {
          setError('Failed to update confirmation status. The confirmation link may have expired or there may be a server issue. Please try again.')
        }
      }
    } catch (err) {
      console.error('❌ Exception in handleResponse:', err)

      // Handle network errors specifically
      if (err instanceof TypeError && err.message?.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check your internet connection and try again.')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      console.log('🔄 Setting processing to false')
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading confirmation details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive">Invalid Link</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push('/')}
              className="w-full"
            >
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!confirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive">Invalid Link</CardTitle>
            <CardDescription>The confirmation link is invalid or has expired.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push('/')}
              className="w-full"
            >
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If debt details are not available, show limited confirmation
  if (!confirmation.debts) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 dark:text-yellow-400 mx-auto mb-4" />
            <CardTitle>Confirmation Required</CardTitle>
            <CardDescription>
              A debt confirmation has been requested. Please log in to view full details and respond.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              <p>Token: {confirmation.token.substring(0, 20)}...</p>
              <p>Expires: {new Date(confirmation.expires_at).toLocaleString()}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => handleResponse('accepted')}
                disabled={processing}
                className="flex-1"
                variant="default"
              >
                {processing ? 'Processing...' : 'Accept'}
              </Button>
              <Button
                onClick={() => handleResponse('rejected')}
                disabled={processing}
                className="flex-1"
                variant="destructive"
              >
                {processing ? 'Processing...' : 'Reject'}
              </Button>
            </div>
            <Button
              onClick={() => router.push('/auth/signin')}
              variant="outline"
              className="w-full"
            >
              Sign In to View Details
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // At this point, we know confirmation.debts is not null due to the check above
  const debt = confirmation.debts!
  const creditor = debt.profiles || {}
  const debtor = debt.counterparty || {}
  const amount = (debt.amount_minor / 100).toFixed(2)

  // If already responded
  if (confirmation.status !== 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            {confirmation.status === 'accepted' ? (
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
            ) : (
              <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            )}
            <CardTitle>
              {confirmation.status === 'accepted' ? 'Debt Accepted!' : 'Debt Rejected'}
            </CardTitle>
            <CardDescription>
              {confirmation.status === 'accepted'
                ? 'You have successfully accepted this debt agreement.'
                : 'You have rejected this debt agreement.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push('/')}
              className="w-full"
            >
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Debt Agreement Confirmation</CardTitle>
            <CardDescription>
              Please review the details below and confirm your response
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Creditor Info */}
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h3 className="font-semibold text-foreground mb-2">From</h3>
              <p className="text-foreground">{creditor?.name || 'Unknown Creditor'}</p>
              <p className="text-muted-foreground text-sm">{creditor?.email}</p>
            </div>

            {/* Debt Details */}
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg text-foreground">Agreement Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <p className="text-lg font-semibold text-foreground">{debt.currency} {amount}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                  <p className="text-lg text-foreground">{new Date(debt.due_date).toLocaleDateString()}</p>
                </div>
              </div>

              {debt.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="mt-1 p-3 bg-muted rounded text-foreground">{debt.description}</p>
                </div>
              )}
            </div>

            {/* Debtor Info */}
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h3 className="font-semibold text-foreground mb-2">To</h3>
              <p className="text-foreground">{debtor?.name || 'You'}</p>
              {debtor?.email && <p className="text-muted-foreground text-sm">{debtor.email}</p>}
              {debtor?.phone_e164 && <p className="text-muted-foreground text-sm">{debtor.phone_e164}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => handleResponse('accepted')}
                disabled={processing}
                className="flex-1"
                size="lg"
              >
                {processing ? 'Processing...' : 'Accept Debt'}
              </Button>

              <Button
                onClick={() => handleResponse('rejected')}
                disabled={processing}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                {processing ? 'Processing...' : 'Reject Debt'}
              </Button>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                By accepting this debt, you agree to the terms and conditions of this agreement.
                Make sure to review all details carefully before responding.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
