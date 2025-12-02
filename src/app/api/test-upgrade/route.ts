import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Force update to Premium
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        email: user.email!, 
        subscription_plan: 'Premium' 
      })
      .select()

    return NextResponse.json({ 
      success: true, 
      data,
      error: error?.message,
      userId: user.id 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Test upgrade failed' }, { status: 500 })
  }
}