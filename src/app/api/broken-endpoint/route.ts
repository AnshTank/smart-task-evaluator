// BROKEN API ENDPOINT - Multiple security and functionality issues

import { NextRequest, NextResponse } from 'next/server'

// Bug: No authentication check
export async function POST(request: NextRequest) {
  // Bug: No try-catch error handling
  const data = await request.json()
  
  // Bug: No input validation
  const { userId, taskData } = data
  
  // Bug: SQL injection vulnerability (if this were real SQL)
  const query = `SELECT * FROM tasks WHERE user_id = '${userId}'`
  
  // Bug: Exposing sensitive information
  const response = {
    success: true,
    data: taskData,
    internalConfig: {
      databaseUrl: process.env.DATABASE_URL,
      apiKeys: process.env.OPENAI_API_KEY
    }
  }
  
  // Bug: No CORS headers, improper status codes
  return new Response(JSON.stringify(response))
}

// Bug: Allowing all HTTP methods without proper handling
export async function GET() {
  // Bug: Returning sensitive server information
  return NextResponse.json({
    server: 'production',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    secrets: {
      jwt: process.env.JWT_SECRET,
      stripe: process.env.STRIPE_SECRET_KEY
    }
  })
}

// Bug: No rate limiting, no input sanitization
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  // Bug: No validation of ID format
  // Bug: Direct deletion without ownership check
  console.log(`Deleting task with ID: ${id}`)
  
  return NextResponse.json({ deleted: true })
}