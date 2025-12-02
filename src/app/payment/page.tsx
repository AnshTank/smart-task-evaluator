'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import EnhancedNavbar from '@/components/EnhancedNavbar'
import { CreditCard, Lock, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function PaymentPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  
  const planType = searchParams.get('plan') || 'Premium'

  const getPrice = () => {
    if (planType === 'Ultra Premium') return '$19.99'
    if (planType === 'Premium') return '$4.99'
    return '$0.00'
  }

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (!user) throw new Error('User not authenticated')

      // Update user plan in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ subscription_plan: planType })
        .eq('id', user.id)

      if (updateError) throw updateError
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <EnhancedNavbar />
        <div className="max-w-md mx-auto py-16 px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Welcome to {planType}!</p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <EnhancedNavbar />
      
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Upgrade to {planType}</h2>
            <p className="text-gray-600 mt-2">Unlock premium features and enhanced analysis</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">{planType} Plan</span>
              <span className="text-xl font-bold text-gray-900">{getPrice()}</span>
            </div>
            
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Detailed code analysis
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Security vulnerability assessment
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Performance optimization tips
              </li>
              {planType === 'Ultra Premium' && (
                <>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Unlimited evaluations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Priority AI processing
                  </li>
                </>
              )}
            </ul>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay Now {getPrice()}
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Secure payment processing. Your card information is encrypted and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}