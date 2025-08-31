import emailjs from '@emailjs/browser'

// Initialize EmailJS
if (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
  emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY)
}

export interface NotificationData {
  debtorName: string
  creditorName: string
  amount: string
  currency: string
  dueDate: string
  description?: string
}

export async function sendDebtNotificationEmail(
  to: string,
  data: NotificationData
): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
    console.warn('EmailJS not configured')
    return false
  }

  try {
    const templateParams = {
      to_email: to,
      debtor_name: data.debtorName,
      creditor_name: data.creditorName,
      amount: data.amount,
      currency: data.currency,
      due_date: data.dueDate,
      description: data.description || 'No description provided',
      reply_to: process.env.NEXT_PUBLIC_EMAILJS_FROM_EMAIL || 'noreply@confiado.com'
    }

    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      templateParams
    )

    console.log(`Email sent successfully to ${to}`)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

export async function sendDebtNotification(
  email: string | undefined,
  data: NotificationData
): Promise<{ emailSent: boolean }> {
  const results = {
    emailSent: false,
  }

  // Send email if email is provided
  if (email) {
    results.emailSent = await sendDebtNotificationEmail(email, data)
  }

  return results
}
