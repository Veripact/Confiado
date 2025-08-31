"use client"

import type React from "react"

import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase-client"
import { Web3AuthBridgeContext } from '@/components/providers'
import { getUserProfile } from "@/lib/profile"
import { generateDebtConfirmationToken, generateConfirmationLink } from '@/lib/debt-confirmations'

export function CreateDebtForm() {
  const [debtorName, setDebtorName] = useState("")
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [dueDate, setDueDate] = useState<Date>()
  const [description, setDescription] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [creditorId, setCreditorId] = useState<string | null>(null)
  const [confirmationToken, setConfirmationToken] = useState<string | null>(null)

  const router = useRouter()

  // Use the bridge context (safe wrapper around @web3auth hooks)
  const bridge = useContext(Web3AuthBridgeContext)
  const userInfo = bridge?.userInfo ?? null
  const bridgeLoading = bridge?.loading ?? false

  // Get the current user's profile ID
  useEffect(() => {
    const getCreditorProfile = async () => {
      if (userInfo?.email) {
        try {
          const profile = await getUserProfile(userInfo.email)
          if (profile?.id) {
            setCreditorId(profile.id)
          } else {
            // No profile found, set error so UI reflects this
            setError('No profile found for your account. Please complete your profile.')
          }
        } catch (err) {
          console.error('Error fetching profile:', err)
          setError('Failed to load profile information')
        }
      }
    }

    // If bridge is still initializing, wait
    if (bridgeLoading) return

    // If bridge finished and no user info, redirect to signin
    if (!bridgeLoading && !userInfo) {
      router.replace('/auth/signin')
      return
    }

    getCreditorProfile()
  }, [userInfo, bridgeLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!creditorId) {
      setError("Unable to identify creditor. Please try refreshing the page.")
      setIsLoading(false)
      return
    }

    // Check if debtor contact matches creditor's contact to prevent self-debt
    if (contactMethod === "email" && email === userInfo?.email) {
      setError("You cannot create a debt with yourself as the debtor.")
      setIsLoading(false)
      return
    }

    try {
      // Upsert debtor profile (create if doesn't exist, or use existing)
      const upsertData: any = {
        name: debtorName,
      }

      if (contactMethod === "email") {
        upsertData.email = email
      } else {
        upsertData.phone_e164 = phone
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert(upsertData, {
          onConflict: contactMethod === "email" ? 'email' : 'phone_e164',
          ignoreDuplicates: false
        })
        .select('id')
        .single()

      if (profileError) throw profileError

      const debtorId = profileData.id

      // Double-check that debtor is not the same as creditor
      if (debtorId === creditorId) {
        setError("You cannot create a debt with yourself as the debtor.")
        setIsLoading(false)
        return
      }

      // Insert debt
      const { data: debtData, error: debtError } = await supabase
        .from('debts')
        .insert({
          creditor_id: creditorId,
          counterparty_id: debtorId,
          amount_minor: Math.round(parseFloat(amount) * 100),
          currency,
          due_date: dueDate?.toISOString().split('T')[0], // YYYY-MM-DD format
          description: description || null,
          status: 'active',
        })
        .select('id')
        .single()

      if (debtError) throw debtError

      const debtId = debtData.id

      // Generate confirmation link
      const confirmationToken = await generateDebtConfirmationToken(debtId)
      if (!confirmationToken) {
        setError('Failed to generate confirmation link')
        setIsLoading(false)
        return
      }

      setIsSubmitted(true)
      setConfirmationToken(confirmationToken)
    } catch (err: any) {
      setError(err.message || "Failed to create debt")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-8 space-y-4">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
        <h3 className="text-xl font-serif font-semibold text-primary">Debt Created Successfully!</h3>
        <p className="text-muted-foreground">
          A unique confirmation link has been generated for {debtorName}.
          Share this link with the debtor so they can review and accept the debt agreement.
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm">
            <strong>Confirmation Link:</strong>
          </p>
            <div className="mt-2 p-3 bg-white border rounded font-mono text-sm break-all text-black">
            {confirmationToken ? generateConfirmationLink(confirmationToken) : 'Generating link...'}
            </div>
          <Button
            onClick={() => {
              const link = confirmationToken ? generateConfirmationLink(confirmationToken) : ''
              navigator.clipboard.writeText(link)
            }}
            className="mt-2"
            size="sm"
          >
            Copy Link
          </Button>
        </div>
        <div className="bg-muted p-4 rounded-lg">
            <div className="space-y-2 text-sm">
            <p>
              <strong>Next Steps:</strong>
            </p>
            <p>
              Send the link above to the debtor via your preferred communication method (email, SMS, etc.). Once they accept the debt, you'll be notified and can view the status in your dashboard.
            </p>
            <p>
              This debt will be permanently recorded on the blockchain for transparency and security.
            </p>
            </div>
        </div>
        <Button
          onClick={() => router.push("/dashboard")}
          className="mt-4"
        >
          Return to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {!creditorId && !error && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md">
          {bridgeLoading ? 'Loading your profile information...' : 'Preparing profile...'}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="debtorName">Debtor Name *</Label>
          <Input
            id="debtorName"
            type="text"
            placeholder="Enter the debtor's full name"
            value={debtorName}
            onChange={(e) => setDebtorName(e.target.value)}
            required
            disabled={!creditorId}
          />
        </div>

        <div className="space-y-3">
          <Label>Contact Method *</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={contactMethod === "email" ? "default" : "outline"}
              size="sm"
              onClick={() => setContactMethod("email")}
              className="flex-1"
              disabled={!creditorId}
            >
              Email
            </Button>
            <Button
              type="button"
              variant={contactMethod === "phone" ? "default" : "outline"}
              size="sm"
              onClick={() => setContactMethod("phone")}
              className="flex-1"
              disabled={!creditorId}
            >
              Phone
            </Button>
          </div>

          {contactMethod === "email" ? (
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="debtor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={!creditorId}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={!creditorId}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={!creditorId}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={setCurrency} disabled={!creditorId}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="CAD">CAD (C$)</SelectItem>
                <SelectItem value="AUD">AUD (A$)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Due Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                disabled={!creditorId}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Select due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Add any additional details about this debt agreement..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            disabled={!creditorId}
          />
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium mb-2">Agreement Summary</h4>
        <div className="text-sm space-y-1">
          <p>
            <strong>Debtor:</strong> {debtorName || "Not specified"}
          </p>
          <p>
            <strong>Contact:</strong> {contactMethod === "email" ? email || "Not specified" : phone || "Not specified"}
          </p>
          <p>
            <strong>Amount:</strong> {amount ? `${currency} ${amount}` : "Not specified"}
          </p>
          <p>
            <strong>Due Date:</strong> {dueDate ? format(dueDate, "PPP") : "Not specified"}
          </p>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !creditorId || !debtorName || !amount || !dueDate || (!email && !phone)}
      >
        {isLoading ? "Creating Debt..." : "Create Debt"}
      </Button>
    </form>
  )
}
