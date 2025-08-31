import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables:', {
        NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
        SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceKey
      })
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Create Supabase client with service role key for server-side operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { token, status } = await request.json()

    if (!token || !status) {
      return NextResponse.json(
        { error: 'Missing token or status' },
        { status: 400 }
      )
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "accepted" or "rejected"' },
        { status: 400 }
      )
    }

    console.log('🔄 Server: Updating confirmation status for token:', token, 'to:', status)

    // First check if the token exists and is valid
    const { data: checkData, error: checkError } = await supabase
      .from('debt_confirmations')
      .select('id, status, expires_at')
      .eq('token', token)
      .single()

    if (checkError) {
      console.error('❌ Server: Error checking token:', checkError)
      return NextResponse.json(
        { error: 'Token validation failed' },
        { status: 400 }
      )
    }

    if (!checkData) {
      console.error('❌ Server: Token not found:', token)
      return NextResponse.json(
        { error: 'Invalid confirmation token' },
        { status: 404 }
      )
    }

    if (checkData.status !== 'pending') {
      console.log('⚠️ Server: Token already processed with status:', checkData.status)
      return NextResponse.json(
        { error: 'Confirmation already processed' },
        { status: 409 }
      )
    }

    if (new Date(checkData.expires_at) <= new Date()) {
      console.log('⚠️ Server: Token expired:', checkData.expires_at)
      return NextResponse.json(
        { error: 'Confirmation link has expired' },
        { status: 410 }
      )
    }

    // Update the confirmation status
    const { data, error } = await supabase
      .from('debt_confirmations')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('token', token)
      .select('id')

    if (error) {
      console.error('❌ Server: Error updating confirmation:', error)
      return NextResponse.json(
        { error: 'Failed to update confirmation status' },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      console.error('❌ Server: No rows updated')
      return NextResponse.json(
        { error: 'Failed to update confirmation' },
        { status: 500 }
      )
    }

    console.log('✅ Server: Successfully updated confirmation status to:', status)

    return NextResponse.json({
      success: true,
      message: `Confirmation ${status} successfully`
    })

  } catch (error) {
    console.error('❌ Server: Exception in confirmation update:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
