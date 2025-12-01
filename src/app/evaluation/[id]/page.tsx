'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Task, Evaluation } from '@/types'
import Navbar from '@/components/Navbar'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, TrendingUp, Lock, CreditCard } from 'lucide-react'

export default function EvaluationPage() {
  const [evaluation, setEvaluation] = useState<Evaluation & { task: Task } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    fetchEvaluation()
  }, [params.id])

  const fetchEvaluation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

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

  const handleUnlockReport = () => {
    router.push(`/payment/${evaluation?.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (error || !evaluation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <XCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-2 text-sm text-red-700">{error || 'Evaluation not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{evaluation.task.title}</h1>
            <p className="mt-2 text-sm text-gray-600">{evaluation.task.description}</p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center">
                <div className="text-3xl font-bold text-primary-600">{evaluation.score}</div>
                <div className="ml-1 text-sm text-gray-500">/100</div>
              </div>
              <div className="text-sm text-gray-500">
                Evaluated on {new Date(evaluation.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h2 className="ml-2 text-lg font-medium text-gray-900">Strengths</h2>
              </div>
              <ul className="space-y-2">
                {evaluation.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <span className="ml-3 text-sm text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <XCircle className="h-5 w-5 text-red-500" />
                <h2 className="ml-2 text-lg font-medium text-gray-900">Areas for Improvement</h2>
              </div>
              <ul className="space-y-2">
                {evaluation.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                    <span className="ml-3 text-sm text-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <h2 className="ml-2 text-lg font-medium text-gray-900">Improvement Suggestions</h2>
              </div>
              <ul className="space-y-3">
                {evaluation.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                      {index + 1}
                    </div>
                    <span className="ml-3 text-sm text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Full Report */}
            <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Detailed Analysis Report</h2>
                {!evaluation.is_paid && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Lock className="h-4 w-4 mr-1" />
                    Premium Content
                  </div>
                )}
              </div>
              
              {evaluation.is_paid ? (
                <div className="prose max-w-none">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{evaluation.full_report}</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white z-10"></div>
                  <div className="text-sm text-gray-700 blur-sm">
                    {evaluation.full_report?.substring(0, 200)}...
                  </div>
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleUnlockReport}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Unlock Full Report - $4.99
                    </button>
                    <p className="mt-2 text-xs text-gray-500">
                      Get detailed code analysis, security insights, and personalized learning recommendations
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Code Display */}
          {evaluation.task.code && (
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Submitted Code</h2>
              <pre className="bg-gray-50 rounded-md p-4 overflow-x-auto">
                <code className="text-sm text-gray-800">{evaluation.task.code}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}