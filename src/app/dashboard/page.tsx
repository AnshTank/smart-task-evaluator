'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Task, Evaluation } from '@/types'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { Plus, Clock, CheckCircle, XCircle, Eye } from 'lucide-react'

export default function DashboardPage() {
  const [tasks, setTasks] = useState<(Task & { evaluation?: Evaluation })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select(`
          *,
          evaluations (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const tasksWithEvaluations = tasksData?.map(task => ({
        ...task,
        evaluation: task.evaluations?.[0]
      })) || []

      setTasks(tasksWithEvaluations)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'evaluating':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'evaluating':
        return 'Evaluating'
      case 'failed':
        return 'Failed'
      default:
        return 'Pending'
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Link
              href="/submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Submit New Task
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Clock className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by submitting your first coding task.</p>
              <div className="mt-6">
                <Link
                  href="/submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Task
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <li key={task.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getStatusIcon(task.status)}
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{task.title}</p>
                            <p className="text-sm text-gray-500">{task.description.substring(0, 100)}...</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">{getStatusText(task.status)}</span>
                          {task.evaluation && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">
                                Score: {task.evaluation.score}/100
                              </span>
                              <Link
                                href={`/evaluation/${task.evaluation.id}`}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-primary-700 bg-primary-100 hover:bg-primary-200"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="text-xs text-gray-500">
                            Created {new Date(task.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}