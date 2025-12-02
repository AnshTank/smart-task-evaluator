import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { evaluateTask } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { taskId, title, description, code } = body
  
  try {

    if (!taskId || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update task status to evaluating
    await supabase
      .from('tasks')
      .update({ status: 'evaluating' })
      .eq('id', taskId)

    // Get AI evaluation (defaulting to premium tier for paid reports)
    const evaluation = await evaluateTask(title, description, code, 'premium')

    // Save evaluation to database
    const { data: evaluationData, error: evalError } = await supabase
      .from('evaluations')
      .insert([
        {
          task_id: taskId,
          score: evaluation.score,
          strengths: evaluation.strengths,
          weaknesses: evaluation.weaknesses,
          improvements: evaluation.improvements,
          full_report: evaluation.full_report,
          is_paid: false,
        }
      ])
      .select()
      .single()

    if (evalError) throw evalError

    // Update task status to completed
    await supabase
      .from('tasks')
      .update({ status: 'completed' })
      .eq('id', taskId)

    return NextResponse.json({ 
      success: true, 
      evaluationId: evaluationData.id 
    })

  } catch (error) {
    console.error('Evaluation error:', error)

    // Update task status to failed if there was an error
    if (taskId) {
      await supabase
        .from('tasks')
        .update({ status: 'failed' })
        .eq('id', taskId)
    }

    return NextResponse.json(
      { error: 'Failed to evaluate task' },
      { status: 500 }
    )
  }
}