import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export function useUserPlan() {
  const [user, setUser] = useState<User | null>(null)
  const [userPlan, setUserPlan] = useState<string>('Free')
  const [loading, setLoading] = useState(true)

  const fetchUserPlan = async (currentUser?: User | null) => {
    const userToUse = currentUser || user
    if (!userToUse) return

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_plan')
      .eq('id', userToUse.id)
      .single()

    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist, create it
      await supabase
        .from('profiles')
        .insert({ id: userToUse.id, email: userToUse.email!, subscription_plan: 'Free' })
      setUserPlan('Free')
    } else {
      setUserPlan(profile?.subscription_plan || 'Free')
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        await fetchUserPlan(user)
      }
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchUserPlan(session.user)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const refreshUserPlan = () => fetchUserPlan()

  return { user, userPlan, loading, refreshUserPlan, setUserPlan }
}