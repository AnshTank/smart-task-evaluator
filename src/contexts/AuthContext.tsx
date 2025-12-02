'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {}
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout
    let sessionTimeout: NodeJS.Timeout

    const resetTimer = () => {
      clearTimeout(inactivityTimer)
      inactivityTimer = setTimeout(() => {
        logout()
      }, 600000) // 10 minutes
    }

    const handleActivity = () => {
      resetTimer()
    }

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Track page visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(inactivityTimer)
      } else {
        resetTimer()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Get initial session with timeout
    sessionTimeout = setTimeout(() => {
      console.warn('Session loading timeout, setting loading to false')
      setLoading(false)
    }, 3000) // 3 second timeout

    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(sessionTimeout)
      setUser(session?.user ?? null)
      setLoading(false)
      if (session?.user) resetTimer()
    }).catch((error) => {
      console.error('Error getting session:', error)
      clearTimeout(sessionTimeout)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      
      if (session?.user) {
        resetTimer()
      } else {
        clearTimeout(inactivityTimer)
      }
    })

    return () => {
      clearTimeout(inactivityTimer)
      clearTimeout(sessionTimeout)
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}