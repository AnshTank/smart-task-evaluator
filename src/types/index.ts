export interface User {
  id: string
  email: string
  full_name?: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description: string
  code?: string
  status: 'pending' | 'evaluating' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

export interface Evaluation {
  id: string
  task_id: string
  score: number
  strengths: string[]
  weaknesses: string[]
  improvements: string[]
  full_report?: string
  is_paid: boolean
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  evaluation_id: string
  stripe_payment_id: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

export interface AIEvaluationResponse {
  score: number
  strengths: string[]
  weaknesses: string[]
  improvements: string[]
  full_report: string
}