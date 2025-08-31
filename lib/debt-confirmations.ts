import { supabase } from '@/lib/supabase-client'
import crypto from 'crypto'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// Helper function to get Supabase client safely
function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase client not initialized - missing environment variables')
  }
  return supabase
}

export interface DebtConfirmationData {
  debtId: string
  debtorName: string
  creditorName: string
  amount: string
  currency: string
  dueDate: string
  description?: string
}

export async function generateDebtConfirmationToken(debtId: string): Promise<string | null> {
  console.log('🔄 Starting confirmation token generation for debt:', debtId)

  // Debug database setup first
  console.log('🔍 Checking database setup...')
  await debugDatabaseSetup()

  const token = generateSecureToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  console.log('📝 Generated token:', token.substring(0, 10) + '...')
  console.log('⏰ Expires at:', expiresAt.toISOString())

  try {
    const { error } = await getSupabaseClient()
      .from('debt_confirmations')
      .insert({
        debt_id: debtId,
        token,
        expires_at: expiresAt.toISOString(),
        status: 'pending'
      })

    if (error) {
      console.error('Error creating confirmation token:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })

      // Run debug check
      console.log('🔍 Running database debug check...')
      await debugDatabaseSetup()

      console.error('📝 Attempted to insert:', {
        debt_id: debtId,
        token: token.substring(0, 10) + '...',
        expires_at: expiresAt.toISOString(),
        status: 'pending'
      })
      return null
    }

    return token
  } catch (error) {
    console.error('Error generating confirmation token:', error)
    return null
  }
}

export async function getDebtConfirmationByToken(token: string) {
  try {
    console.log('🔍 Fetching confirmation for token:', token)

    // Debug what's in the database
    await debugConfirmationToken(token)

    // Test basic table access
    const { data: testData, error: testError } = await getSupabaseClient()
      .from('debt_confirmations')
      .select('count')
      .limit(1)

    console.log('🧪 Basic table access test:', { testData, testError })

    // First, let's check if the token exists at all
    const { data: checkData, error: checkError } = await getSupabaseClient()
      .from('debt_confirmations')
      .select('id, token, status, expires_at, debt_id')
      .eq('token', token)

    console.log('🔍 Token existence check:', { checkData, checkError })

    if (checkError) {
      console.error('❌ Error checking token existence:', checkError)
      return null
    }

    if (!checkData || checkData.length === 0) {
      console.log('⚠️ No confirmation found for token:', token)
      return null
    }

    const confirmation = checkData[0]
    console.log('✅ Found confirmation:', confirmation)

    // Check if token is expired
    if (new Date(confirmation.expires_at) <= new Date()) {
      console.log('⚠️ Token expired:', confirmation.expires_at)
      return null
    }

    // Check if token is already processed
    if (confirmation.status !== 'pending') {
      console.log('⚠️ Token already processed:', confirmation.status)
      return null
    }

    // Now fetch the debt details separately to avoid RLS issues
    const { data: debtData, error: debtError } = await getSupabaseClient()
      .from('debts')
      .select('id, amount_minor, currency, due_date, description, creditor_id, counterparty_id')
      .eq('id', confirmation.debt_id)
      .single()

    console.log('🔍 Debt fetch result:', { debtData, debtError })

    if (debtError) {
      console.error('❌ Error fetching debt:', debtError)
      // If we can't fetch the debt due to RLS, return basic confirmation info
      return {
        ...confirmation,
        debts: null // Indicate debt details unavailable
      }
    }

    if (!debtData) {
      console.error('❌ No debt data found')
      return null
    }

    // Fetch creditor profile
    const { data: creditorData, error: creditorError } = await getSupabaseClient()
      .from('profiles')
      .select('name, email')
      .eq('id', debtData.creditor_id)
      .single()

    if (creditorError) {
      console.error('❌ Error fetching creditor:', creditorError)
    }

    // Fetch debtor profile
    const { data: debtorData, error: debtorError } = await getSupabaseClient()
      .from('profiles')
      .select('name, email, phone_e164')
      .eq('id', debtData.counterparty_id)
      .single()

    if (debtorError) {
      console.error('❌ Error fetching debtor:', debtorError)
    }

    // Structure the data properly
    const structuredData = {
      ...confirmation,
      debts: {
        ...debtData,
        profiles: creditorData || { name: 'Unknown Creditor', email: null },
        counterparty: debtorData || { name: 'Unknown Debtor', email: null, phone_e164: null }
      }
    }

    console.log('📋 Processed confirmation data:', structuredData)
    return structuredData
  } catch (error) {
    console.error('❌ Error fetching confirmation by token:', error)
    return null
  }
}

export async function updateDebtConfirmationStatus(
  token: string,
  status: 'accepted' | 'rejected'
): Promise<boolean> {
  try {
    console.log('🔄 Updating confirmation status for token:', token, 'to:', status)

    // Use server-side API route instead of direct Supabase calls
    const response = await fetch('/api/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, status }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('❌ API error:', result.error)
      return false
    }

    if (result.success) {
      console.log('✅ Successfully updated confirmation status to:', status)
      return true
    } else {
      console.error('❌ API returned success=false:', result)
      return false
    }

  } catch (error) {
    console.error('❌ Exception updating confirmation status:', error)

    // Handle network errors specifically
    if (error instanceof TypeError && error.message?.includes('Failed to fetch')) {
      console.error('❌ Network connectivity issue: Please check your internet connection and try again.')
    }

    return false
  }
}

export function generateConfirmationLink(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/debt/confirm/${token}`
}

export async function createTestConfirmation(): Promise<string | null> {
  try {
    console.log('🧪 Creating test confirmation...')

    // First create a test debt
    const { data: debtData, error: debtError } = await getSupabaseClient()
      .from('debts')
      .insert({
        creditor_id: 'test-creditor-id', // You'll need to replace this with a real user ID
        counterparty_id: 'test-debtor-id', // You'll need to replace this with a real user ID
        amount_minor: 10000, // $100.00
        currency: 'USD',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        description: 'Test debt for confirmation system',
        status: 'active'
      })
      .select('id')
      .single()

    if (debtError) {
      console.error('❌ Error creating test debt:', debtError)
      return null
    }

    console.log('✅ Created test debt:', debtData.id)

    // Generate confirmation token
    const token = await generateDebtConfirmationToken(debtData.id)
    console.log('✅ Generated test token:', token)

    return token
  } catch (error) {
    console.error('❌ Error creating test confirmation:', error)
    return null
  }
}

export async function checkDatabaseTables() {
  try {
    // Check if debt_confirmations table exists
    const { data, error } = await supabase
      .from('debt_confirmations')
      .select('id')
      .limit(1)

    if (error) {
      console.error('debt_confirmations table check failed:', error)
      return { debt_confirmations: false, error: error.message }
    }

    return { debt_confirmations: true, error: null }
  } catch (error) {
    console.error('Database check failed:', error)
    return { debt_confirmations: false, error: 'Connection failed' }
  }
}

export async function debugDatabaseSetup() {
  try {
    console.log('🔍 Starting database debug...')

    // Check if tables exist
    const tables = ['debts', 'profiles', 'debt_confirmations']
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)

        if (error) {
          console.error(`❌ Table '${table}' check failed:`, error)
        } else {
          console.log(`✅ Table '${table}' exists`)
        }
      } catch (err) {
        console.error(`❌ Error checking table '${table}':`, err)
      }
    }

    // Check RLS policies
    console.log('🔒 Checking RLS policies...')
    const { data: policies, error: policiesError } = await getSupabaseClient()
      .rpc('get_policies', { table_name: 'debt_confirmations' })

    if (policiesError) {
      console.log('ℹ️ Could not check policies (this is normal)')
    }

    return { success: true }
  } catch (error) {
    console.error('❌ Database debug failed:', error)
    return { success: false, error }
  }
}

export async function debugConfirmationToken(token: string) {
  try {
    console.log('🔍 Debugging token:', token)

    // Check if table exists and has data
    const { data: allConfirmations, error: allError } = await getSupabaseClient()
      .from('debt_confirmations')
      .select('id, token, status, expires_at')
      .limit(5)

    console.log('📊 All confirmations in DB:', { allConfirmations, allError })

    // Check specific token
    const { data: tokenData, error: tokenError } = await getSupabaseClient()
      .from('debt_confirmations')
      .select('*')
      .eq('token', token)

    console.log('🎯 Specific token data:', { tokenData, tokenError })

    return { allConfirmations, tokenData, errors: { allError, tokenError } }
  } catch (error) {
    console.error('❌ Debug function error:', error)
    return { error }
  }
}

export async function testSupabaseConnection(): Promise<boolean> {
  try {
    console.log('🧪 Testing Supabase connection...')
    const { data, error } = await supabase
      .from('debt_confirmations')
      .select('count')
      .limit(1)

    console.log('🧪 Connection test result:', { data, error })

    if (error) {
      console.error('❌ Supabase connection failed:', error)
      return false
    }

    console.log('✅ Supabase connection successful')
    return true
  } catch (err) {
    console.error('❌ Supabase connection exception:', err)
    return false
  }
}

function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex')
}
