'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Crown, Zap, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import EnhancedNavbar from '@/components/EnhancedNavbar'

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState('premium')
  const [user, setUser] = useState<User | null>(null)
  const [userPlan, setUserPlan] = useState<string>('Free')
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const evaluationId = searchParams.get('evaluationId')

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
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Upgrade failed:', error)
    } finally {
      setUpgrading(false)
    }
  }

  useEffect(() => {
    const getUser = async () => {
      console.log('PlansPage: Getting user...')
      const { data: { user } } = await supabase.auth.getUser()
      console.log('PlansPage: User:', user?.id, user?.email)
      setUser(user)
      
      if (user) {
        console.log('PlansPage: Fetching user plan...')
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('subscription_plan')
          .eq('id', user.id)
          .single()
        
        console.log('PlansPage: Profile data:', profile, 'Error:', error)
        
        if (error && error.code === 'PGRST116') {
          console.log('PlansPage: Creating new profile...')
          await supabase
            .from('profiles')
            .insert({ id: user.id, email: user.email!, subscription_plan: 'Free' })
          setUserPlan('Free')
        } else {
          const plan = profile?.subscription_plan || 'Free'
          console.log('PlansPage: Setting user plan to:', plan)
          setUserPlan(plan)
        }
      }
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
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
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSelectPlan = (plan: string) => {
    if (!user) {
      router.push('/auth/signup')
      return
    }
    router.push(`/payment?plan=${plan}`)
  }

  const getButtonText = (targetPlan: string) => {
    if (!user) return 'Get Started'
    if (userPlan === targetPlan) return 'Current Plan'
    
    const planHierarchy = { 'Free': 0, 'Premium': 1, 'Ultra Premium': 2 }
    const currentLevel = planHierarchy[userPlan as keyof typeof planHierarchy] || 0
    const targetLevel = planHierarchy[targetPlan as keyof typeof planHierarchy] || 0
    
    if (targetLevel > currentLevel) {
      return `Upgrade to ${targetPlan}`
    } else {
      return `Switch to ${targetPlan}`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <EnhancedNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <EnhancedNavbar />
      
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your coding journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className={`bg-white rounded-2xl shadow-lg p-8 flex flex-col h-full relative ${
            user && userPlan === 'Free' ? 'border-2 border-green-500' : 'border border-gray-200'
          }`}>
            {user && userPlan === 'Free' && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">Current Plan</span>
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-5xl font-bold text-gray-900 mb-2">$0</div>
              <p className="text-gray-600">Perfect for getting started</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Basic code evaluation</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Score and key insights</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">3 evaluations per month</span>
              </li>
            </ul>
            
            <button
              onClick={() => handleSelectPlan('Free')}
              disabled={!!(user && userPlan === 'Free')}
              className={`w-full py-3 px-4 border border-gray-300 rounded-xl font-medium transition-colors mt-auto ${
                user && userPlan === 'Free' 
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {getButtonText('Free')}
            </button>
          </div>

          {/* Premium Plan */}
          <div className={`bg-white rounded-2xl shadow-xl p-8 relative flex flex-col h-full ${
            user && userPlan === 'Premium' ? 'border-2 border-green-500' : 'border-2 border-blue-500'
          }`}>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className={`px-6 py-2 rounded-full text-sm font-medium flex items-center ${
                user && userPlan === 'Premium' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
              }`}>
                <Crown className="h-4 w-4 mr-1" />
                {user && userPlan === 'Premium' ? 'Current Plan' : 'Most Popular'}
              </span>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">$4.99</div>
              <p className="text-gray-600">Per detailed report</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Everything in Free</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Detailed analysis report</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Security vulnerability scan</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Performance optimization tips</span>
              </li>
            </ul>
            
            <button
              onClick={() => handleSelectPlan('Premium')}
              disabled={!!(user && userPlan === 'Premium')}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center mt-auto ${
                user && userPlan === 'Premium'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
              }`}
            >
              {getButtonText('Premium')}
              {!(user && userPlan === 'Premium') && <ArrowRight className="h-4 w-4 ml-2" />}
            </button>
          </div>

          {/* Ultra Premium Plan */}
          <div className={`rounded-2xl shadow-xl p-8 text-white flex flex-col h-full relative ${
            user && userPlan === 'Ultra Premium' 
              ? 'bg-gradient-to-br from-green-600 to-green-700 border-2 border-green-400' 
              : 'bg-gradient-to-br from-purple-600 to-blue-600'
          }`}>
            {user && userPlan === 'Ultra Premium' && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">Current Plan</span>
              </div>
            )}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-yellow-300 mr-2" />
                <h3 className="text-2xl font-bold">Ultra Premium</h3>
              </div>
              <div className="text-5xl font-bold mb-2">$19.99</div>
              <p className="text-purple-100">Per month</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" />
                <span>Everything in Premium</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" />
                <span>Unlimited evaluations</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" />
                <span>Priority AI processing</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" />
                <span>Personal coding mentor</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" />
                <span>Custom learning paths</span>
              </li>
            </ul>
            
            <button
              onClick={() => handleSelectPlan('Ultra Premium')}
              disabled={!!(user && userPlan === 'Ultra Premium')}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center mt-auto ${
                user && userPlan === 'Ultra Premium'
                  ? 'bg-white/20 text-white/60 cursor-not-allowed'
                  : 'bg-white text-purple-600 hover:bg-gray-100'
              }`}
            >
              {getButtonText('Ultra Premium')}
              {!(user && userPlan === 'Ultra Premium') && <Zap className="h-4 w-4 ml-2" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}