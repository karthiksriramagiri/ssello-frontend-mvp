import { NextRequest, NextResponse } from 'next/server'
import { SellingPartner } from 'amazon-sp-api'

// Initialize SP-API client with environment variables
function createSPAPIClient() {
  const credentials = {
    refresh_token: process.env.AMAZON_REFRESH_TOKEN,
    lwa_app_id: process.env.AMAZON_LWA_APP_ID,
    lwa_client_secret: process.env.AMAZON_LWA_CLIENT_SECRET,
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
    },
    endpoints_versions: {
      catalogItems: '2022-04-01' // Use the latest version
    }
  })
}

function extractListPrice(lpVal: any): number {
  try {
    if (lpVal?.amount) {
      return parseFloat(lpVal.amount)
    } else if (typeof lpVal === 'object' && lpVal.amount) {
      return parseFloat(lpVal.amount)
    }
    return 0.0
  } catch (error) {
    return 0.0
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
    
    const spClient = createSPAPIClient()
    let response: any
    
    // Handle different search types
    if (searchType === 'asin') {
      console.log(`Performing ASIN search for: ${userInput}`)
      try {
        response = await spClient.callAPI({
          operation: 'getCatalogItem',
          endpoint: 'catalogItems',
          path: {
            asin: userInput
          },
          query: {
            marketplaceIds: ['ATVPDKIKX0DER'], // US marketplace
            includedData: ['attributes', 'images', 'productTypes', 'salesRanks', 'summaries', 'variations']
          }
        })
      } catch (err: any) {
        console.error('ASIN search error:', err)
        // If ASIN not found, return empty results
        if (err.code === 'NOT_FOUND') {
          return NextResponse.json({ items: [] })
        }
        throw err
      }
    } else {
      // For both UPC and keyword searches, use searchCatalogItems
      console.log(`Performing ${searchType} search for: ${userInput}`)
      
      const searchParams: any = {
        marketplaceIds: ['ATVPDKIKX0DER'],
        includedData: ['attributes', 'images', 'productTypes', 'salesRanks', 'summaries', 'variations'],
        pageSize: 20
      }
      
      if (searchType === 'upc') {
        searchParams.identifiers = [userInput]
        searchParams.identifiersType = 'UPC'
      } else {
        // For keyword search, use keywords parameter
        searchParams.keywords = userInput
      }
      
      try {
        response = await spClient.callAPI({
          operation: 'searchCatalogItems',
          endpoint: 'catalogItems',
          query: searchParams
        })
      } catch (err: any) {
        console.error('Search error:', err)
        // Return empty results for search errors
        return NextResponse.json({ items: [] })
      }
    }
    
    console.log('API response received')
    
    // Handle single item response (ASIN search)
    let items: any[] = []
    if (searchType === 'asin' && response) {
      items = response ? [response] : []
    } else if (response?.items) {
      items = response.items || []
    }
    
    console.log(`Found ${items.length} potential items`)
    
    // Process and format items
    const formattedItems = []
    for (const item of items) {
      try {
        // Extract basic information
        const asin = item.asin || ''
        
        // Get attributes safely
        const attributes = item.attributes || {}
        
        // Extract title - try multiple possible attribute names
        let title = 'Unknown Product'
        const titleAttr = attributes.item_name || attributes.title || attributes.itemName || item.summaries?.marketplaceSummaries?.[0]?.itemName
        if (Array.isArray(titleAttr) && titleAttr.length > 0) {
          title = String(titleAttr[0].value || titleAttr[0])
        } else if (titleAttr && typeof titleAttr === 'string') {
          title = titleAttr
        } else if (titleAttr?.value) {
          title = String(titleAttr.value)
        }
        
        // Extract brand  
        let brand = ''
        const brandAttr = attributes.brand || attributes.brand_name || item.summaries?.marketplaceSummaries?.[0]?.brand
        if (Array.isArray(brandAttr) && brandAttr.length > 0) {
          brand = String(brandAttr[0].value || brandAttr[0])
        } else if (brandAttr && typeof brandAttr === 'string') {
          brand = brandAttr
        } else if (brandAttr?.value) {
          brand = String(brandAttr.value)
        }
        
        // Extract list price
        let listPrice = 0.0
        const listPriceAttr = attributes.list_price || attributes.listPrice
        if (listPriceAttr) {
          if (Array.isArray(listPriceAttr) && listPriceAttr.length > 0) {
            listPrice = extractListPrice(listPriceAttr[0].value || listPriceAttr[0])
          } else {
            listPrice = extractListPrice(listPriceAttr.value || listPriceAttr)
          }
        }
        
        // Extract image URL - handle different image structures
        let imageUrl = ''
        if (item.images) {
          // Try primary images first
          const primaryImages = item.images.primary || item.images
          if (Array.isArray(primaryImages) && primaryImages.length > 0) {
            const firstImage = primaryImages[0]
            if (firstImage.link) {
              imageUrl = firstImage.link
            } else if (firstImage.images && Array.isArray(firstImage.images)) {
              // Look for the largest image
              const largeImage = firstImage.images.find((img: any) => img.variant === 'LARGE') || firstImage.images[0]
              if (largeImage?.link) {
                imageUrl = largeImage.link
              }
            }
          }
        }
        
        // Extract product type/category
        let category = ''
        if (item.productTypes && Array.isArray(item.productTypes) && item.productTypes.length > 0) {
          category = String(item.productTypes[0].productType || item.productTypes[0])
        }
        
        const formattedItem = {
          asin: asin,
          title: title,
          brand: brand,
          listPrice: listPrice,
          imageUrl: imageUrl || '/placeholder.svg?height=80&width=80',
          category: category,
          // Include additional fields that might be useful
          ASIN: asin,
          Title: title,
          price: String(listPrice),
          OriginalMSRP: String(listPrice),
          image: imageUrl || '/placeholder.svg?height=80&width=80',
          source: 'amazon'
        }
        
        formattedItems.push(formattedItem)
        
      } catch (error) {
        console.error('Error processing item:', error)
        continue
      }
    }
    
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