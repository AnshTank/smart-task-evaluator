import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import stripe from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object
      const { evaluationId, userId } = paymentIntent.metadata

      // Update evaluation as paid
      await supabase
        .from('evaluations')
        .update({ is_paid: true })
        .eq('id', evaluationId)

      // Update user plan to Premium
      await supabase
        .from('profiles')
        .update({ subscription_plan: 'Premium' })
        .eq('id', userId)

      // Record payment
      await supabase
        .from('payments')
        .insert({
          user_id: userId,
          evaluation_id: evaluationId,
          stripe_payment_id: paymentIntent.id,
          amount: paymentIntent.amount,
          status: 'completed'
        })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}