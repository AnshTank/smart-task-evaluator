'use client'

import Link from 'next/link'
import { ArrowRight, Code, Zap, Shield, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import EnhancedNavbar from '@/components/EnhancedNavbar'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [userPlan, setUserPlan] = useState<string>('Free')
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      console.log('HomePage: Getting user...')
      const { data: { user } } = await supabase.auth.getUser()
      console.log('HomePage: User:', user?.id, user?.email)
      setUser(user)
      
      if (user) {
        // Fetch user plan from database
        console.log('HomePage: Fetching user plan...')
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('subscription_plan')
          .eq('id', user.id)
          .single()
        
        console.log('HomePage: Profile data:', profile, 'Error:', error)
        
        if (error && error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          console.log('HomePage: Creating new profile...')
          await supabase
            .from('profiles')
            .insert({ id: user.id, email: user.email!, subscription_plan: 'Free' })
          setUserPlan('Free')
        } else {
          const plan = profile?.subscription_plan || 'Free'
          console.log('HomePage: Setting user plan to:', plan)
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
          // Fetch user plan from database
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('subscription_plan')
            .eq('id', session.user.id)
            .single()
          
          if (error && error.code === 'PGRST116') {
            // Profile doesn't exist, create it
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

  const refreshUserPlan = async () => {
    if (!user) return
    
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
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <EnhancedNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <EnhancedNavbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">AI-Powered</span>
            <span className="block text-primary-600">Code Evaluation</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Get instant feedback on your coding tasks with our advanced AI evaluator. 
            Improve your code quality, learn best practices, and accelerate your development skills.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href={user ? "/submit" : "/auth/signup"}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
              >
                {user ? "Submit Code" : "Start evaluating"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-primary-600" />
                <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">Instant Analysis</h3>
              </div>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Get comprehensive code evaluation results in seconds with our advanced AI algorithms.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-primary-600" />
                <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">Detailed Feedback</h3>
              </div>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Receive detailed insights on strengths, weaknesses, and improvement suggestions.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Code className="h-8 w-8 text-primary-600" />
                <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">Multiple Languages</h3>
              </div>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Support for various programming languages and frameworks.
              </p>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Plan</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Select the perfect plan for your coding journey</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {/* Free Plan */}
              <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col h-full relative ${
                user && userPlan === 'Free' ? 'border-2 border-green-500' : 'border border-gray-200 dark:border-gray-700'
              }`}>
                {user && userPlan === 'Free' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">Current Plan</span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-4">$0</div>
                  <p className="text-gray-600 dark:text-gray-300">Perfect for getting started</p>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Basic code evaluation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Score and key insights</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">3 evaluations per month</span>
                  </li>
                </ul>
                {user && userPlan === 'Free' ? (
                  <button
                    disabled
                    className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed mt-auto"
                  >
                    Current Plan
                  </button>
                ) : user && userPlan !== 'Free' ? (
                  <button
                    onClick={() => upgradePlan('Free')}
                    disabled={upgrading}
                    className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mt-auto disabled:opacity-50"
                  >
                    {upgrading ? 'Downgrading...' : 'Downgrade to Free'}
                  </button>
                ) : (
                  <Link
                    href={user ? "/submit" : "/auth/signup"}
                    className="w-full block text-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mt-auto"
                  >
                    {user ? "Start Evaluating" : "Get Started"}
                  </Link>
                )}
              </div>

              {/* Premium Plan */}
              <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 relative flex flex-col h-full ${
                user && userPlan === 'Premium' ? 'border-2 border-green-500' : 'border-2 border-blue-500'
              }`}>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                    user && userPlan === 'Premium' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {user && userPlan === 'Premium' ? 'Current Plan' : 'Most Popular'}
                  </span>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Premium</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-4">$4.99</div>
                  <p className="text-gray-600 dark:text-gray-300">Per detailed report</p>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Everything in Free</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Detailed analysis report</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Security vulnerability scan</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Performance optimization tips</span>
                  </li>
                </ul>
                {user && userPlan === 'Premium' ? (
                  <button
                    disabled
                    className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-xl font-medium cursor-not-allowed mt-auto"
                  >
                    Current Plan
                  </button>
                ) : user ? (
                  <Link
                    href="/plans"
                    className="w-full block text-center py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors mt-auto"
                  >
                    Upgrade to Premium
                  </Link>
                ) : (
                  <Link
                    href="/auth/signup"
                    className="w-full block text-center py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors mt-auto"
                  >
                    Get Premium
                  </Link>
                )}
              </div>

              {/* Ultra Premium Plan */}
              <div className={`rounded-2xl shadow-xl p-8 text-white flex flex-col h-full relative ${
                user && userPlan === 'Ultra Premium' ? 'bg-gradient-to-br from-green-600 to-green-700 border-2 border-green-400' : 'bg-gradient-to-br from-purple-600 to-blue-600'
              }`}>
                {user && userPlan === 'Ultra Premium' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">Current Plan</span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Ultra Premium</h3>
                  <div className="text-4xl font-bold mb-4">$19.99</div>
                  <p className={user && userPlan === 'Ultra Premium' ? 'text-green-100' : 'text-purple-100'}>Per month</p>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-300 mr-3" />
                    <span>Everything in Premium</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-300 mr-3" />
                    <span>Unlimited evaluations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-300 mr-3" />
                    <span>Priority AI processing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-300 mr-3" />
                    <span>Personal coding mentor</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-300 mr-3" />
                    <span>Custom learning paths</span>
                  </li>
                </ul>
                {user && userPlan === 'Ultra Premium' ? (
                  <button
                    disabled
                    className="w-full py-3 px-4 bg-white/20 dark:bg-gray-800/50 text-white/60 dark:text-gray-400 rounded-xl font-medium cursor-not-allowed mt-auto"
                  >
                    Current Plan
                  </button>
                ) : user ? (
                  <Link
                    href="/plans"
                    className="w-full block text-center py-3 px-4 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mt-auto"
                  >
                    Go Ultra Premium
                  </Link>
                ) : (
                  <Link
                    href="/auth/signup"
                    className="w-full block text-center py-3 px-4 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mt-auto"
                  >
                    Go Ultra Premium
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Demo Analysis Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">See AI Analysis in Action</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Here&apos;s what a detailed code evaluation looks like</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Sample Analysis: Binary Search Function</h3>
                <p className="text-blue-100">Score: 85/100</p>
              </div>
              
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-green-600 mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Strengths
                  </h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Correct implementation of binary search algorithm
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Efficient O(log n) time complexity
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Clean and readable code structure
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-orange-600 mb-3 flex items-center">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Improvements
                  </h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Add input validation for edge cases
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Include comprehensive documentation
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Consider iterative approach for better space complexity
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  <strong>Detailed Analysis Preview:</strong> &quot;Your binary search implementation demonstrates solid algorithmic thinking. The recursive approach is mathematically sound and handles the divide-and-conquer strategy effectively...&quot;
                </p>
                <div className="text-center">
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Get Your Code Analyzed
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}