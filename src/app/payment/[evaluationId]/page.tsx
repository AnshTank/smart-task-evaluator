'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { CreditCard, Lock, CheckCircle } from 'lucide-react'

export default function PaymentPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const params = useParams()
  const router = useRouter()

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update evaluation to paid status
      const { error: updateError } = await supabase
        .from('evaluations')
        .update({ is_paid: true })
        .eq('id', params.evaluationId)

      if (updateError) throw updateError

      // Create payment record
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('payments')
          .insert([
            {
              user_id: user.id,
              evaluation_id: params.evaluationId as string,
              stripe_payment_id: `pi_demo_${Date.now()}`,
              amount: 499,
              status: 'completed'
            }
          ])
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/evaluation/${params.evaluationId}`)
      }, 2000)

    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto py-16 px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your full report has been unlocked.</p>
            <p className="text-sm text-gray-500">Redirecting to your evaluation...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <Lock className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Unlock Full Report</h2>
            <p className="text-gray-600 mt-2">Get detailed analysis and personalized recommendations</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">Full Evaluation Report</span>
              <span className="text-xl font-bold text-gray-900">$4.99</span>
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
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Personalized learning recommendations
              </li>
            </ul>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay $4.99
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