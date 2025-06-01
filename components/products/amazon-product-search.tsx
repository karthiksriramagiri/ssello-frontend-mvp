"use client"

import React, { useState, useCallback, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, 
  Package, 
  Loader2, 
  ExternalLink, 
  DollarSign, 
  Barcode,
  Tag,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ShoppingCart
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { API_CONFIG, buildApiUrl } from "@/lib/api-config"

interface AmazonProduct {
  asin: string
  ASIN: string
  title: string
  Title: string
  source: string
  upc: string
  UPC: string
  price: string
  OriginalMSRP: string
  attributes: Record<string, any>
  category: string
  browse_nodes?: Array<{ id: string; name: string }>
  image?: string
  images?: string[]
}

interface BuyboxData {
  asin: string
  buybox_price: number | null
  buybox_seller: string | null
  is_amazon_buybox: boolean
  offers_count: number
  offers: Array<{
    type: string
    price: number
    currency: string
    condition: string
    is_seller: boolean
  }>
}

interface AmazonProductSearchProps {
  onProductSelect?: (product: AmazonProduct & { buybox_data?: BuyboxData }) => void
  trigger?: React.ReactNode
}

export function AmazonProductSearch({ onProductSelect, trigger }: AmazonProductSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"keyword" | "asin" | "upc">("keyword")
  const [products, setProducts] = useState<AmazonProduct[]>([])
  const [buyboxData, setBuyboxData] = useState<Record<string, BuyboxData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loadingBuybox, setLoadingBuybox] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Clear results when modal closes
  useEffect(() => {
    if (!isOpen) {
      setProducts([])
      setBuyboxData({})
      setError(null)
    }
  }, [isOpen])

  const searchProducts = useCallback(async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search term")
      return
    }

    setIsLoading(true)
    setError(null)
    setProducts([])

    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AMAZON_SEARCH), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery.trim(),
          type: searchType,
          identifier_type: searchType === "asin" ? "ASIN" : searchType === "upc" ? "UPC" : undefined
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.message || data.error)
      }

      if (data.items && data.items.length > 0) {
        setProducts(data.items)
        toast({
          title: "Search completed",
          description: `Found ${data.items.length} products`,
        })
      } else {
        setError("No products found. Try a different search term.")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to search products"
      setError(errorMessage)
      toast({
        title: "Search failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, searchType, toast])

  const fetchBuyboxData = useCallback(async (asin: string) => {
    if (buyboxData[asin] || loadingBuybox[asin]) return

    setLoadingBuybox(prev => ({ ...prev, [asin]: true }))

    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.AMAZON_BUYBOX}/${asin}`))
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setBuyboxData(prev => ({ ...prev, [asin]: data }))
    } catch (err) {
      console.error(`Failed to fetch buybox data for ${asin}:`, err)
    } finally {
      setLoadingBuybox(prev => ({ ...prev, [asin]: false }))
    }
  }, [buyboxData, loadingBuybox])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchProducts()
  }

  const handleProductSelect = (product: AmazonProduct) => {
    const productWithBuybox = {
      ...product,
      buybox_data: buyboxData[product.asin]
    }
    
    onProductSelect?.(productWithBuybox)
    setIsOpen(false)
    
    toast({
      title: "Product selected",
      description: `Selected: ${product.title}`,
    })
  }

  const getSearchTypeLabel = (type: string) => {
    switch (type) {
      case "asin": return "ASIN"
      case "upc": return "UPC"
      default: return "Keyword"
    }
  }

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return isNaN(numPrice) ? 'N/A' : `$${numPrice.toFixed(2)}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="bg-white hover:bg-gray-50 border-gray-200 rounded-lg shadow-sm">
            <Search className="h-4 w-4 mr-2" />
            Search Amazon Products
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="h-5 w-5 text-orange-500" />
            Amazon Product Search
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col flex-1 min-h-0 p-6">
          {/* Search Form */}
          <div className="space-y-4 flex-shrink-0 mb-4">
            <Tabs value={searchType} onValueChange={(value) => setSearchType(value as typeof searchType)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="keyword">
                  <Search className="h-4 w-4 mr-2" />
                  Keyword
                </TabsTrigger>
                <TabsTrigger value="asin">
                  <Barcode className="h-4 w-4 mr-2" />
                  ASIN
                </TabsTrigger>
                <TabsTrigger value="upc">
                  <Tag className="h-4 w-4 mr-2" />
                  UPC
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Enter ${getSearchTypeLabel(searchType).toLowerCase()}...`}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !searchQuery.trim()}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex-shrink-0 mb-4">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Results Container */}
          <div className="flex-1 min-h-0">
            {products.length > 0 && (
              <div className="h-full">
                <p className="text-sm text-gray-600 mb-3 flex-shrink-0">
                  Results for: <span className="font-medium">{searchQuery}</span>
                </p>
                <ScrollArea className="h-[calc(100%-2rem)]">
                  <div className="space-y-3 pr-3">
                    {products.map((product) => (
                      <ProductCard
                        key={product.asin}
                        product={product}
                        buyboxData={buyboxData[product.asin]}
                        isLoadingBuybox={loadingBuybox[product.asin]}
                        onFetchBuybox={() => fetchBuyboxData(product.asin)}
                        onSelect={() => handleProductSelect(product)}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {!isLoading && products.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Search className="h-8 w-8 mb-2" />
                <p>Search for Amazon products to get started</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ProductCardProps {
  product: AmazonProduct
  buyboxData?: BuyboxData
  isLoadingBuybox?: boolean
  onFetchBuybox: () => void
  onSelect: () => void
}

function ProductCard({ product, buyboxData, isLoadingBuybox, onFetchBuybox, onSelect }: ProductCardProps) {
  const hasImage = product.image && product.image !== "/placeholder.svg"

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return isNaN(numPrice) ? 'N/A' : `$${numPrice.toFixed(2)}`
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={onSelect}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {hasImage ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=80&width=80"
                  }}
                />
              ) : (
                <Package className="h-8 w-8 text-gray-400" />
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                {product.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect()
                }}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                ASIN: {product.asin}
              </Badge>
              {product.upc && (
                <Badge variant="outline" className="text-xs">
                  UPC: {product.upc}
                </Badge>
              )}
              {product.category && (
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-gray-600">MSRP: </span>
                  <span className="font-semibold text-green-600">
                    {formatPrice(product.price)}
                  </span>
                </div>

                {buyboxData ? (
                  <div className="text-sm">
                    <span className="text-gray-600">Buybox: </span>
                    <span className="font-semibold text-blue-600">
                      {buyboxData.buybox_price ? formatPrice(buyboxData.buybox_price) : 'N/A'}
                    </span>
                    {buyboxData.is_amazon_buybox && (
                      <Badge variant="default" className="ml-1 text-xs bg-orange-500">
                        Amazon
                      </Badge>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onFetchBuybox()
                    }}
                    disabled={isLoadingBuybox}
                    className="text-xs h-6"
                  >
                    {isLoadingBuybox ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    )}
                    Get Price
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {product.browse_nodes && product.browse_nodes.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {product.browse_nodes[0].name}
                  </Badge>
                )}
                <CheckCircle2 className="h-4 w-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 