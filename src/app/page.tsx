import Link from 'next/link'
import { ArrowRight, Code, Zap, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Code className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Smart Task Evaluator</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">AI-Powered</span>
            <span className="block text-primary-600">Code Evaluation</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Get instant feedback on your coding tasks with our advanced AI evaluator. 
            Improve your code quality, learn best practices, and accelerate your development skills.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/auth/signup"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
              >
                Start evaluating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-primary-600" />
                <h3 className="ml-3 text-lg font-medium text-gray-900">Instant Analysis</h3>
              </div>
              <p className="mt-2 text-base text-gray-500">
                Get comprehensive code evaluation results in seconds with our advanced AI algorithms.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-primary-600" />
                <h3 className="ml-3 text-lg font-medium text-gray-900">Detailed Feedback</h3>
              </div>
              <p className="mt-2 text-base text-gray-500">
                Receive detailed insights on strengths, weaknesses, and improvement suggestions.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Code className="h-8 w-8 text-primary-600" />
                <h3 className="ml-3 text-lg font-medium text-gray-900">Multiple Languages</h3>
              </div>
              <p className="mt-2 text-base text-gray-500">
                Support for various programming languages and frameworks.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}