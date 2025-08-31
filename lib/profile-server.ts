import { createServerSupabaseClient } from './supabase'

export interface UserProfile {
  id?: string
  name: string | null
  email: string | null
  phone_e164?: string | null
  ens_label?: string | null
  currency?: string
}

export async function getUserProfileByEmail(email: string): Promise<UserProfile | null> {
  try {
    const supabase = await createServerSupabaseClient()

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
    console.error('Error in getUserProfileByEmail:', error)
    return null
  }
}

export async function getUserProfileById(id: string): Promise<UserProfile | null> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null
      }
      console.error('Error fetching user profile by ID:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getUserProfileById:', error)
    return null
  }
}
