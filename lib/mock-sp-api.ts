import { API_CONFIG, buildApiUrl } from "./api-config"

export interface SPProduct {
  id: string
  asin: string
  title: string
  imageUrl: string
  price?: number
  category?: string
  brand?: string
  upc?: string
}

export async function fetchProductsFromSPAPI(query: string, searchType: string): Promise<SPProduct[]> {
  console.log(`Calling real SP-API backend for ${searchType}: ${query}`)
  
  try {
    // Map the searchType to our backend's expected format
    let apiSearchType = "keyword"
    let identifierType = undefined
    
    if (searchType === "asin") {
      apiSearchType = "asin"
      identifierType = "ASIN"
    } else if (searchType === "upc_ean") {
      apiSearchType = "upc"
      identifierType = "UPC"
    }
    
    // Call our Flask backend
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AMAZON_SEARCH), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query.trim(),
        type: apiSearchType,
        identifier_type: identifierType
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.message || data.error)
    }

    // Convert the Amazon API response to SPProduct format
    const products: SPProduct[] = (data.items || []).map((item: any) => ({
      id: item.asin,
      asin: item.asin,
      title: item.title,
      imageUrl: item.image || "/placeholder.svg?height=80&width=80",
      price: parseFloat(item.price) || undefined,
      category: item.category || "General",
      brand: item.attributes?.brand?.[0]?.value || "Unknown",
      upc: item.upc || undefined
    }))

    console.log(`Found ${products.length} products from real SP-API`)
    return products

  } catch (error) {
    console.error("Error calling real SP-API:", error)
    throw new Error(`Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
