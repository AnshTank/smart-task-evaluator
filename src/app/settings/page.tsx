'use client'

import { useState, useEffect } from 'react'
import EnhancedNavbar from '@/components/EnhancedNavbar'
import { supabase } from '@/lib/supabase'
import { User, Settings, CreditCard, Bell } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [userPlan, setUserPlan] = useState<string>('Free')
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  const upgradePlan = async (plan: string) => {
    if (!user || upgrading) return
    
    setUpgrading(true)
    try {
      const response = await fetch('/api/upgrade-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId: user.id })
      })
      
      if (response.ok) {
        setUserPlan(plan)
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Upgrade failed:', error)
    } finally {
      setUpgrading(false)
    }
  }

  const refreshUserPlan = async () => {
    if (!user) return
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_plan')
      .eq('id', user.id)
      .single()
    
    if (error && error.code === 'PGRST116') {
      await supabase
        .from('profiles')
        .insert({ id: user.id, email: user.email!, subscription_plan: 'Free' })
      setUserPlan('Free')
    } else {
      setUserPlan(profile?.subscription_plan || 'Free')
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('subscription_plan')
          .eq('id', user.id)
          .single()
        
        if (error && error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          await supabase
            .from('profiles')
            .insert({ id: user.id, email: user.email!, subscription_plan: 'Free' })
          setUserPlan('Free')
        } else {
          setUserPlan(profile?.subscription_plan || 'Free')
        }
      }
      setLoading(false)
    }
    getUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('subscription_plan')
            .eq('id', session.user.id)
            .single()
          
          if (error && error.code === 'PGRST116') {
            await supabase
              .from('profiles')
              .insert({ id: session.user.id, email: session.user.email!, subscription_plan: 'Free' })
            setUserPlan('Free')
          } else {
            setUserPlan(profile?.subscription_plan || 'Free')
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <EnhancedNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <EnhancedNavbar />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Manage your account settings and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Plan</label>
                <div className="mt-1 flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    userPlan === 'Ultra Premium' ? 'bg-purple-100 text-purple-800' :
                    userPlan === 'Premium' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {userPlan} Plan
                  </span>
                  <Link
                    href="/plans"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Change Plan
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Subscription & Billing</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Current Plan</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{userPlan} - {userPlan === 'Free' ? '$0/month' : userPlan === 'Premium' ? '$4.99/report' : '$19.99/month'}</p>
                </div>
                <Link
                  href="/plans"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Manage Subscription
                </Link>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Notification Preferences</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about your evaluations</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Marketing Emails</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive tips and product updates</p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}