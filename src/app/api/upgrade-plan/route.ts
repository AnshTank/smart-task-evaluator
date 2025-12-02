import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { plan, userId } = await request.json()

    if (!plan || !['Free', 'Premium', 'Ultra Premium'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Update user plan using service role
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ subscription_plan: plan })
      .eq('id', userId)
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, plan, data })
  } catch (error) {
    console.error('Plan upgrade error:', error)
    return NextResponse.json(
      { error: `Failed to upgrade plan: ${error}` },
      { status: 500 }
    )
  }
}