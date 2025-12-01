import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import stripe from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { evaluationId } = await request.json()

    if (!evaluationId) {
      return NextResponse.json(
        { error: 'Evaluation ID is required' },
        { status: 400 }
      )
    }

    // Get user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify evaluation exists and belongs to user
    const { data: evaluation, error: evalError } = await supabase
      .from('evaluations')
      .select(`
        *,
        tasks (user_id)
      `)
      .eq('id', evaluationId)
      .single()

    if (evalError || !evaluation) {
      return NextResponse.json(
        { error: 'Evaluation not found' },
        { status: 404 }
      )
    }

    if (evaluation.tasks.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    if (evaluation.is_paid) {
      return NextResponse.json(
        { error: 'Report already unlocked' },
        { status: 400 }
      )
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 499, // $4.99 in cents
      currency: 'usd',
      metadata: {
        evaluationId,
        userId: user.id,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })

  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}