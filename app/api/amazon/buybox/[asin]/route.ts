import { NextRequest, NextResponse } from 'next/server'
import { SellingPartner } from 'amazon-sp-api'

// Initialize SP-API client with environment variables
function createSPAPIClient() {
  const credentials = {
    refresh_token: process.env.AMAZON_REFRESH_TOKEN,
    lwa_app_id: process.env.AMAZON_LWA_APP_ID,
    lwa_client_secret: process.env.AMAZON_LWA_CLIENT_SECRET,
    seller_id: process.env.AMAZON_SELLER_ID || 'A13NBKN6I076SR',
  }

  // Validate that all required environment variables are set
  const requiredVars = ['AMAZON_REFRESH_TOKEN', 'AMAZON_LWA_APP_ID', 'AMAZON_LWA_CLIENT_SECRET']
  const missingVars = requiredVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }

  return new SellingPartner({
    region: 'na', // North America region
    refresh_token: credentials.refresh_token,
    credentials: {
      SELLING_PARTNER_APP_CLIENT_ID: credentials.lwa_app_id,
      SELLING_PARTNER_APP_CLIENT_SECRET: credentials.lwa_client_secret
    }
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: { asin: string } }
) {
  try {
    const { asin } = params
    
    if (!asin) {
      return NextResponse.json({ error: 'ASIN parameter is required' }, { status: 400 })
    }
    
    console.log(`Getting buybox and offers for ASIN: ${asin}`)
    
    const spClient = createSPAPIClient()
    
    // Initialize result with default values
    const result = {
      buybox_price: 0.0,
      lowest_price: 0.0,
      offers_count: 0
    }
    
    try {
      // Get competitive pricing
      const pricingResponse = await spClient.callAPI({
        operation: 'getCompetitivePricing',
        endpoint: 'productPricing',
        query: {
          Asins: [asin],
          ItemType: 'Asin',
          MarketplaceId: 'ATVPDKIKX0DER'
        },
        options: {
          version: 'v0'
        }
      })
      
      if (pricingResponse && Array.isArray(pricingResponse)) {
        for (const pricingData of pricingResponse) {
          if (pricingData?.CompetitivePricing) {
            const competitivePricing = pricingData.CompetitivePricing
            
            // Extract buybox price
            if (competitivePricing?.CompetitivePrices && Array.isArray(competitivePricing.CompetitivePrices)) {
              for (const priceData of competitivePricing.CompetitivePrices) {
                if (priceData?.condition === 'New' && 
                    priceData?.Price?.ListingPrice?.Amount) {
                  result.buybox_price = parseFloat(priceData.Price.ListingPrice.Amount)
                  break
                }
              }
            }
          }
        }
      }
      
    } catch (error) {
      console.warn(`Could not get competitive pricing for ${asin}:`, error)
    }
    
    console.log('Buybox lookup completed')
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error(`Error getting buybox price for ${params?.asin}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' }, 
      { status: 500 }
    )
  }
} 