'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Task, Evaluation } from '@/types'
import EnhancedNavbar from '@/components/EnhancedNavbar'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, TrendingUp, Lock, CreditCard, RefreshCw } from 'lucide-react'
import PremiumModal from '@/components/PremiumModal'
import { useAuth } from '@/contexts/AuthContext'

export default function EvaluationPage() {
  const [evaluation, setEvaluation] = useState<Evaluation & { task: Task } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [userPlan, setUserPlan] = useState<string>('Free')
  const [regenerating, setRegenerating] = useState(false)
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    fetchEvaluation()
  }, [params.id])

  const fetchEvaluation = async () => {
    try {
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Fetch user plan
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .single()
      
      setUserPlan(profile?.subscription_plan || 'Free')

      const { data, error } = await supabase
        .from('evaluations')
        .select(`
          *,
          tasks (*)
        `)
        .eq('id', params.id)
        .single()

      if (error) throw error

      // Check if user owns this evaluation
      if (data.tasks.user_id !== user.id) {
        throw new Error('Unauthorized')
      }

      setEvaluation({
        ...data,
        task: data.tasks
      })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerateReport = async () => {
    if (!evaluation || regenerating) return
    
    setRegenerating(true)
    try {
      // Simulate regeneration with current plan
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Refresh the evaluation
      await fetchEvaluation()
    } catch (error) {
      console.error('Regeneration failed:', error)
    } finally {
      setRegenerating(false)
    }
  }

  const handleUnlockReport = () => {
    if (evaluation?.id) {
      router.push(`/plans?evaluationId=${evaluation.id}`)
    }
  }

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

  if (error || !evaluation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <EnhancedNavbar />
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <XCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Error</h3>
                <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error || 'Evaluation not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <EnhancedNavbar />
      
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{evaluation.task.title}</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{evaluation.task.description}</p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center">
                <div className="text-3xl font-bold text-primary-600">{evaluation.score}</div>
                <div className="ml-1 text-sm text-gray-500 dark:text-gray-400">/100</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Evaluated on {new Date(evaluation.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h2 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">Strengths</h2>
              </div>
              <ul className="space-y-2">
                {evaluation.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <XCircle className="h-5 w-5 text-red-500" />
                <h2 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">Areas for Improvement</h2>
              </div>
              <ul className="space-y-2">
                {evaluation.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 lg:col-span-2">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <h2 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">Improvement Suggestions</h2>
              </div>
              <ul className="space-y-3">
                {evaluation.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                      {index + 1}
                    </div>
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Full Report */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 p-8 lg:col-span-2 overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Detailed Analysis Report</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Comprehensive AI-powered code evaluation</p>
                  </div>
                </div>
                {!evaluation.is_paid && (
                  <div className="flex items-center bg-amber-100 text-amber-800 px-3 py-2 rounded-full text-sm font-medium">
                    <Lock className="h-4 w-4 mr-2" />
                    Premium Content
                  </div>
                )}
              </div>
              
              {(evaluation.is_paid || userPlan === 'Premium' || userPlan === 'Ultra Premium') ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap font-medium">
                      {evaluation.full_report || 'Detailed analysis content based on your current plan...'}
                    </div>
                  </div>
                  {!evaluation.is_paid && (userPlan === 'Premium' || userPlan === 'Ultra Premium') && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-blue-800 dark:text-blue-300">
                          Your plan has been upgraded! Generate a new detailed report.
                        </div>
                        <button
                          onClick={handleRegenerateReport}
                          disabled={regenerating}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          {regenerating ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Generate Report
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative min-h-[500px] bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/90 dark:from-gray-800/50 dark:to-gray-800/90 z-10"></div>
                  <div className="p-6 text-gray-700 dark:text-gray-300 blur-[4px] relative">
                    <div className="space-y-6">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-bold text-lg text-blue-900 mb-2">📊 Executive Summary</h3>
                        <p className="leading-relaxed">This comprehensive analysis reveals several critical insights about your code implementation. The algorithm demonstrates strong foundational understanding with proper variable naming conventions and logical flow structure.</p>
                      </div>
                      
                      <div className="border-l-4 border-red-500 pl-4">
                        <h3 className="font-bold text-lg text-red-900 mb-2">🔒 Security Analysis</h3>
                        <p className="leading-relaxed">Your code shows good practices in input validation, however there are potential vulnerabilities in the data handling section that could be exploited. We recommend implementing additional sanitization layers.</p>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-4">
                        <h3 className="font-bold text-lg text-green-900 mb-2">⚡ Performance Optimization</h3>
                        <p className="leading-relaxed">The current implementation has O(n²) complexity which could be improved to O(n log n) by restructuring the nested loops. Memory usage is within acceptable bounds but could benefit from lazy loading techniques.</p>
                      </div>
                      
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h3 className="font-bold text-lg text-purple-900 mb-2">🏗️ Architecture Review</h3>
                        <p className="leading-relaxed">The current design pattern follows MVC principles effectively. However, dependency injection could be improved to enhance testability and reduce coupling between components.</p>
                      </div>
                      
                      <div className="border-l-4 border-orange-500 pl-4">
                        <h3 className="font-bold text-lg text-orange-900 mb-2">🧪 Testing Coverage</h3>
                        <p className="leading-relaxed">Unit test coverage is at 78% which is good, but integration tests are lacking. We recommend adding more end-to-end test scenarios to ensure robust functionality.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-800 flex flex-col items-center justify-center z-20">
                    <div className="text-center bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Unlock Full Analysis</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                        Get detailed code analysis, security insights, performance recommendations, and personalized learning path
                      </p>
                      <button
                        onClick={handleUnlockReport}
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                      >
                        <CreditCard className="h-5 w-5 mr-3" />
                        Unlock for $4.99
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Code Display */}
          {evaluation.task.code && (
            <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Submitted Code</h2>
              <pre className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 overflow-x-auto">
                <code className="text-sm text-gray-800 dark:text-gray-200">{evaluation.task.code}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
      
      {/* Premium Modal */}
      {evaluation && (
        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          evaluationId={evaluation.id}
        />
      )}
    </div>
  )
}