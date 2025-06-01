import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Ssello API is running on Vercel!',
    timestamp: new Date().toISOString(),
    environment: {
      hasAmazonRefreshToken: !!process.env.AMAZON_REFRESH_TOKEN,
      hasAmazonAppId: !!process.env.AMAZON_LWA_APP_ID,
      hasAmazonSecret: !!process.env.AMAZON_LWA_CLIENT_SECRET,
      hasAmazonSellerId: !!process.env.AMAZON_SELLER_ID,
      nodeEnv: process.env.NODE_ENV
    }
  })
}

export async function POST(request: NextRequest) {
  const data = await request.json()
  return NextResponse.json({ 
    message: 'Test POST received',
    received: data,
    timestamp: new Date().toISOString()
  })
} 