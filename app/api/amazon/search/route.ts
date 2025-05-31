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
      response = await spClient.callAPI({
        operation: 'getCatalogItem',
        endpoint: 'catalogItems',
        path: {
          asin: userInput
        },
        query: {
          marketplaceIds: ['ATVPDKIKX0DER'], // US marketplace
          includedData: ['attributes', 'images', 'productTypes', 'relationships', 'salesRanks']
        },
        options: {
          version: '2020-12-01'
        }
      })
    } else {
      // For both UPC and keyword searches, use searchCatalogItems
      console.log(`Performing ${searchType} search for: ${userInput}`)
      
      const searchQuery: any = {
        marketplaceIds: ['ATVPDKIKX0DER'],
        includedData: ['attributes', 'images', 'productTypes', 'relationships', 'salesRanks'],
        pageSize: 20
      }
      
      if (searchType === 'upc') {
        searchQuery.identifiers = [userInput]
        searchQuery.identifiersType = 'UPC'
      } else {
        // keyword search - SP-API documentation shows this should be an array
        // @ts-ignore - TypeScript definitions may not match actual API format
        searchQuery.keywords = [userInput]
      }
      
      response = await spClient.callAPI({
        operation: 'searchCatalogItems',
        endpoint: 'catalogItems',
        query: searchQuery,
        options: {
          version: '2020-12-01'
        }
      })
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
        
        // Extract title
        const titleAttr = attributes.item_name || attributes.title
        let title = 'Unknown Product'
        if (Array.isArray(titleAttr) && titleAttr.length > 0) {
          title = String(titleAttr[0])
        } else if (titleAttr && typeof titleAttr === 'string') {
          title = titleAttr
        }
        
        // Extract brand  
        const brandAttr = attributes.brand
        let brand = ''
        if (Array.isArray(brandAttr) && brandAttr.length > 0) {
          brand = String(brandAttr[0])
        } else if (brandAttr && typeof brandAttr === 'string') {
          brand = brandAttr
        }
        
        // Extract list price
        const listPriceAttr = attributes.list_price
        let listPrice = 0.0
        if (listPriceAttr) {
          if (Array.isArray(listPriceAttr) && listPriceAttr.length > 0) {
            listPrice = extractListPrice(listPriceAttr[0])
          } else {
            listPrice = extractListPrice(listPriceAttr)
          }
        }
        
        // Extract image URL
        let imageUrl = ''
        if (item.images && Array.isArray(item.images)) {
          for (const image of item.images) {
            if (image.images && Array.isArray(image.images)) {
              for (const img of image.images) {
                if (img.link) {
                  imageUrl = img.link
                  break
                }
              }
              if (imageUrl) break
            }
          }
        }
        
        // Extract product type/category
        let category = ''
        if (item.productTypes && Array.isArray(item.productTypes) && item.productTypes.length > 0) {
          category = String(item.productTypes[0])
        }
        
        const formattedItem = {
          asin: asin,
          title: title,
          brand: brand,
          listPrice: listPrice,
          imageUrl: imageUrl,
          category: category
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
    console.error('Error searching Amazon products:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' }, 
      { status: 500 }
    )
  }
} 