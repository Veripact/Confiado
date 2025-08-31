import { NextRequest, NextResponse } from 'next/server'
import { sendDebtNotification } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, debtorName, creditorName, amount, currency, dueDate, description } = body

    // Validate required fields
    if (!debtorName || !creditorName || !amount || !currency || !dueDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send email notification
    const results = await sendDebtNotification(
      email,
      {
        debtorName,
        creditorName,
        amount,
        currency,
        dueDate,
        description,
      }
    )

    return NextResponse.json({
      success: true,
      results,
      message: 'Email notification sent successfully'
    })

  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
