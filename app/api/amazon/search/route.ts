import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Helper function to sign requests
function sign(key: string, msg: string): Buffer {
  return crypto.createHmac('sha256', key).update(msg, 'utf8').digest()
}

function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): Buffer {
  const kDate = sign('AWS4' + key, dateStamp)
  const kRegion = sign(kDate.toString('binary'), regionName)
  const kService = sign(kRegion.toString('binary'), serviceName)
  const kSigning = sign(kService.toString('binary'), 'aws4_request')
  return kSigning
}

// Helper to get access token
async function getAccessToken(): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.AMAZON_REFRESH_TOKEN!,
      client_id: process.env.AMAZON_LWA_APP_ID!,
      client_secret: process.env.AMAZON_LWA_CLIENT_SECRET!
    })

    const response = await fetch('https://api.amazon.com/auth/o2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Failed to get access token:', error)
      return null
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Error getting access token:', error)
    return null
  }
}

// Helper to format product data
function formatProduct(item: any): any {
  try {
    const asin = item.asin || ''
    
    // Extract title from summaries or attributes
    let title = 'Unknown Product'
    if (item.summaries && item.summaries.length > 0) {
      const summary = item.summaries.find((s: any) => s.marketplaceId === 'ATVPDKIKX0DER') || item.summaries[0]
      if (summary && summary.itemName) {
        title = summary.itemName
      }
    } else if (item.attributes?.itemName) {
      const itemNameAttr = item.attributes.itemName
      if (Array.isArray(itemNameAttr) && itemNameAttr.length > 0) {
        title = itemNameAttr[0].value || itemNameAttr[0]
      } else if (typeof itemNameAttr === 'string') {
        title = itemNameAttr
      }
    }
    
    // Extract brand
    let brand = ''
    if (item.summaries && item.summaries.length > 0) {
      const summary = item.summaries.find((s: any) => s.marketplaceId === 'ATVPDKIKX0DER') || item.summaries[0]
      if (summary && summary.brand) {
        brand = summary.brand
      }
    } else if (item.attributes?.brand) {
      const brandAttr = item.attributes.brand
      if (Array.isArray(brandAttr) && brandAttr.length > 0) {
        brand = brandAttr[0].value || brandAttr[0]
      } else if (typeof brandAttr === 'string') {
        brand = brandAttr
      }
    }
    
    // Extract image
    let imageUrl = ''
    if (item.images && item.images.length > 0) {
      const primaryImage = item.images.find((img: any) => img.variant === 'MAIN') || item.images[0]
      if (primaryImage && primaryImage.link) {
        imageUrl = primaryImage.link
      }
    }
    
    // Extract price - simplified
    let listPrice = 0.0
    
    // Extract category
    let category = ''
    if (item.productTypes && item.productTypes.length > 0) {
      category = item.productTypes[0].productType || ''
    }
    
    return {
      asin: asin,
      title: title,
      brand: brand,
      listPrice: listPrice,
      imageUrl: imageUrl || '/placeholder.svg?height=80&width=80',
      category: category,
      // Include additional fields for compatibility
      ASIN: asin,
      Title: title,
      price: String(listPrice),
      OriginalMSRP: String(listPrice),
      image: imageUrl || '/placeholder.svg?height=80&width=80',
      source: 'amazon'
    }
  } catch (error) {
    console.error('Error formatting product:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const userInput = data.query || ''
    const searchType = data.type || 'keyword'
    
    if (!userInput) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }
    
    console.log(`=== STARTING SEARCH FOR: ${userInput} (Type: ${searchType}) ===`)
    
    // Validate environment variables
    const requiredVars = ['AMAZON_REFRESH_TOKEN', 'AMAZON_LWA_APP_ID', 'AMAZON_LWA_CLIENT_SECRET']
    const missingVars = requiredVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
      console.error(`Missing required environment variables: ${missingVars.join(', ')}`)
      return NextResponse.json({ 
        error: 'Configuration error',
        items: []
      }, { status: 500 })
    }
    
    // Get access token
    const accessToken = await getAccessToken()
    if (!accessToken) {
      console.error('Failed to obtain access token')
      return NextResponse.json({ 
        error: 'Authentication failed',
        items: []
      }, { status: 500 })
    }
    
    // Build API URL based on search type
    let apiUrl: string
    const baseUrl = 'https://sellingpartnerapi-na.amazon.com'
    
    if (searchType === 'asin') {
      apiUrl = `${baseUrl}/catalog/2022-04-01/items/${userInput}?marketplaceIds=ATVPDKIKX0DER&includedData=attributes,images,productTypes,salesRanks,summaries`
    } else {
      const params = new URLSearchParams({
        marketplaceIds: 'ATVPDKIKX0DER',
        includedData: 'attributes,images,productTypes,salesRanks,summaries',
        pageSize: '20'
      })
      
      if (searchType === 'upc') {
        params.append('identifiers', userInput)
        params.append('identifiersType', 'UPC')
      } else {
        params.append('keywords', userInput)
      }
      
      apiUrl = `${baseUrl}/catalog/2022-04-01/items?${params.toString()}`
    }
    
    console.log('Making SP-API request to:', apiUrl)
    
    // Make the API request
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-amz-access-token': accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('SP-API Error Response:', response.status, errorText)
      
      // Handle specific error cases
      if (response.status === 404 && searchType === 'asin') {
        return NextResponse.json({ items: [] })
      }
      
      return NextResponse.json({ 
        error: 'Failed to search Amazon catalog',
        details: `HTTP ${response.status}: ${errorText}`,
        items: []
      }, { status: 500 })
    }
    
    const responseData = await response.json()
    console.log('API response received')
    
    // Handle response based on search type
    let items: any[] = []
    if (searchType === 'asin' && responseData) {
      // Single item response
      items = [responseData]
    } else if (responseData.items) {
      // Search results
      items = responseData.items || []
    }
    
    console.log(`Found ${items.length} potential items`)
    
    // Format items
    const formattedItems = items
      .map(formatProduct)
      .filter(item => item !== null)
    
    console.log(`Parsed ${formattedItems.length} valid products`)
    console.log(`Returning items: ${formattedItems.length} found`)
    
    return NextResponse.json({ items: formattedItems })
    
  } catch (error) {
    console.error('SP-API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to search Amazon catalog',
      details: error instanceof Error ? error.message : 'Unknown error',
      items: []
    }, { status: 500 })
  }
} 