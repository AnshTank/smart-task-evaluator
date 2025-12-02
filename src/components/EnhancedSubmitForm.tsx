'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Send, Code, FileText, Sparkles, Upload, CheckCircle } from 'lucide-react'

export default function EnhancedSubmitForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .insert([
          {
            user_id: user.id,
            title,
            description,
            code,
            status: 'pending'
          }
        ])
        .select()
        .single()

      if (taskError) throw taskError

      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: task.id,
          title,
          description,
          code,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to start evaluation')
      }

      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Submit Your Code for AI Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant feedback, detailed analysis, and improvement suggestions powered by advanced AI
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white flex items-center mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <Code className="w-6 h-6 text-white" />
                </div>
                Code Evaluation Form
              </h2>
              <p className="text-blue-100 text-lg">Transform your code with AI-powered insights and recommendations</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Task Title */}
            <div className="space-y-3">
              <label htmlFor="title" className="block text-sm font-bold text-gray-900 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Task Title *
              </label>
              <div className="relative group">
                <FileText className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  id="title"
                  required
                  className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                  placeholder="e.g., Binary Search Implementation, React Component Optimization"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            {/* Programming Language */}
            <div className="space-y-3">
              <label htmlFor="language" className="block text-sm font-bold text-gray-900 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Programming Language
              </label>
              <div className="relative group">
                <Code className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors pointer-events-none" />
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 bg-gray-50/50 hover:bg-white hover:border-gray-300 appearance-none cursor-pointer"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Task Description */}
            <div className="space-y-3">
              <label htmlFor="description" className="block text-sm font-bold text-gray-900 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Task Description *
              </label>
              <div className="relative group">
                <textarea
                  id="description"
                  rows={5}
                  required
                  className="block w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-gray-900 placeholder-gray-400 resize-none bg-gray-50/50 hover:bg-white hover:border-gray-300"
                  placeholder="Describe your coding task, requirements, constraints, and what you're trying to achieve. Be as detailed as possible for better AI analysis..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {description.length}/500
                </div>
              </div>
            </div>

            {/* Code Input */}
            <div className="space-y-3">
              <label htmlFor="code" className="block text-sm font-bold text-gray-900 flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                Your Code (Optional)
              </label>
              <div className="relative group">
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                <textarea
                  id="code"
                  rows={14}
                  className="block w-full px-4 pt-12 pb-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 placeholder-gray-400 font-mono text-sm resize-none bg-gray-900/5 hover:bg-white hover:border-gray-300"
                  placeholder="// Paste your code here for evaluation...
function example() {
  // Your implementation
}"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <div className="absolute top-4 right-4">
                  <Upload className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {code.length} characters
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-700 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                  <span>You can submit just a description for task planning, or include code for detailed evaluation with security analysis and performance insights</span>
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <button
                type="submit"
                disabled={loading}
                className="group relative inline-flex items-center px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-4"></div>
                      <span className="animate-pulse">Analyzing Code...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-white/30 transition-colors">
                        <Send className="h-5 w-5" />
                      </div>
                      Submit for AI Analysis
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Analysis</h3>
            <p className="text-gray-600">Get comprehensive code evaluation results in seconds with our advanced AI algorithms.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailed Feedback</h3>
            <p className="text-gray-600">Receive detailed insights on strengths, weaknesses, and improvement suggestions.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Languages</h3>
            <p className="text-gray-600">Support for various programming languages and frameworks.</p>
          </div>
        </div>
      </div>
    </div>
  )
}