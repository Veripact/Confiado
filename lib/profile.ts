import { supabase } from './supabase-client'

export interface UserProfile {
  id?: string
  name: string | null
  email: string | null
  phone_e164?: string | null
  ens_label?: string | null
  currency?: string
}

export async function upsertUserProfile(userInfo: any): Promise<UserProfile | null> {
  try {
    console.log('upsertUserProfile called with:', userInfo)

    // Extract user information from Web3Auth userInfo or use provided data
    // When called from profile save, use the provided values, otherwise extract from Web3Auth
    let fullName = userInfo?.name || null

    // If no full name but we have firstName and lastName, combine them (only for initial creation)
    if (!fullName && (userInfo?.firstName || userInfo?.lastName) && !userInfo?.phone_e164) {
      const firstName = userInfo?.firstName || ''
      const lastName = userInfo?.lastName || ''
      fullName = `${firstName} ${lastName}`.trim()
    }

    const profileData: UserProfile = {
      name: userInfo?.name || null,
      email: userInfo?.email || null,
      phone_e164: userInfo?.phone_e164 || null,
      ens_label: userInfo?.ens_label || null,
      currency: userInfo?.currency || 'USD'
    }

    console.log('Profile data to upsert:', profileData)

    // Use email as the unique identifier for upsert
    if (!profileData.email) {
      console.warn('No email found in userInfo, cannot create profile')
      return null
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          email: profileData.email,
          name: profileData.name,
          phone_e164: profileData.phone_e164,
          ens_label: profileData.ens_label,
          currency: profileData.currency,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: 'email',
          ignoreDuplicates: false
        }
      )
      .select()
      .single()

    if (error) {
      console.error('Error upserting user profile:', error)
      return null
    }

    console.log('User profile upserted successfully:', data)
    return data
  } catch (error) {
    console.error('Error in upsertUserProfile:', error)
    return null
  }
}

export async function getUserProfile(email: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null
      }
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    return null
  }
}

export async function getMissingProfileInfo(email: string): Promise<string[]> {
  try {
    const profile = await getUserProfile(email)
    if (!profile) {
      return ['name', 'email', 'phone']
    }

    const missing: string[] = []
    if (!profile.name || profile.name.trim() === '') {
      missing.push('name')
    }
    if (!profile.email || profile.email.trim() === '') {
      missing.push('email')
    }
    if (!profile.phone_e164 || profile.phone_e164.trim() === '') {
      missing.push('phone number')
    }

    return missing
  } catch (error) {
    console.error('Error checking missing profile info:', error)
    return ['name', 'email', 'phone number']
  }
}
