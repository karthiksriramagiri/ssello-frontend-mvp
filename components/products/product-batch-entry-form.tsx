"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadCloud, Edit, Search, Loader2, PlusCircle } from "lucide-react"
import { fetchProductsFromSPAPI, type SPProduct } from "@/lib/mock-sp-api"
import { ProductSelectionModal } from "./product-selection-modal"
import { useToast } from "@/hooks/use-toast"
import { BulkUploadModal } from "./bulk-upload-modal"
import { useRouter } from "next/navigation"

interface ProductBatchEntryFormProps {
  onProductAdd?: (product: {
    imageUrl: string
    name: string
    condition: string
    sku: string
    location: string
    cost: number
    priceNew: number
    sellingPrice: number
    buybox: boolean
    quantity: number
    createdDate: string
    sold: number
  }) => void
}

export function ProductBatchEntryForm({ onProductAdd }: ProductBatchEntryFormProps = {}) {
  const [condition, setCondition] = useState("New")
  const [quantity, setQuantity] = useState("1")
  const [fobPrice, setFobPrice] = useState("")
  const [skuInput, setSkuInput] = useState("")
  const [itemIdNameInput, setItemIdNameInput] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalProducts, setModalProducts] = useState<SPProduct[]>([])
  const [isLoadingApi, setIsLoadingApi] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const handleFindItem = async () => {
    if (!itemIdNameInput.trim()) {
      toast({
        title: "Search query empty",
        description: "Please enter an Item ID or Name to search.",
        variant: "destructive",
      })
      return
    }

    if (!quantity.trim() || parseInt(quantity) <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity (greater than 0).",
        variant: "destructive",
      })
      return
    }

    if (!fobPrice.trim() || parseFloat(fobPrice) <= 0) {
      toast({
        title: "Invalid FOB Price",
        description: "Please enter a valid FOB price (greater than 0).",
        variant: "destructive",
      })
      return
    }

    setIsLoadingApi(true)
    setApiError(null)
    try {
      const products = await fetchProductsFromSPAPI(itemIdNameInput, "title")
      setModalProducts(products)
      setIsModalOpen(true)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setApiError(errorMessage)
      toast({
        title: "API Error",
        description: errorMessage,
        variant: "destructive",
      })
      setModalProducts([]) // Ensure modal doesn't show old data on error
      setIsModalOpen(true) // Open modal to show error message
    } finally {
      setIsLoadingApi(false)
    }
  }

  const handleProductSelected = (product: SPProduct) => {
    console.log("Product selected from modal:", product)
    console.log("Current form values:", {
      condition,
      quantity,
      fobPrice,
      sku: skuInput,
      originalSearch: itemIdNameInput,
    })

    // Convert SPProduct to the Product format expected by the table
    const newProduct = {
      imageUrl: product.imageUrl || "/placeholder.svg?height=40&width=40",
      name: product.title,
      condition: condition,
      sku: skuInput || `AMZ-${product.asin}`, // Use user input or generate from ASIN
      location: "TBD", // To be determined
      cost: parseFloat(fobPrice) * 0.7, // Cost is 70% of FOB price
      priceNew: 0.0,
      sellingPrice: parseFloat(fobPrice), // Use FOB price as selling price
      buybox: false, // Default
      quantity: parseInt(quantity) || 1,
      createdDate: new Date().toISOString().split('T')[0], // Today's date
      sold: 0
    }

    // Add the product using the callback
    if (onProductAdd) {
      onProductAdd(newProduct)
    }

    // Reset form fields after adding
    setItemIdNameInput("")
    setSkuInput("")
    setQuantity("1")
    setFobPrice("")
    setCondition("New")

    toast({
      title: "Product Added",
      description: `${product.title} has been added to your inventory with FOB price $${parseFloat(fobPrice).toFixed(2)}.`,
    })
  }

  return (
    <>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <div>
            <Label htmlFor="condition" className="text-sm font-medium text-gray-700 mb-1.5 block">
              Condition
            </Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger id="condition" className="h-10 bg-white border-gray-200 hover:border-blue-300 transition-colors">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl border-0">
                <SelectItem value="New" className="rounded-lg">New</SelectItem>
                <SelectItem value="Used - Like New" className="rounded-lg">Used - Like New</SelectItem>
                <SelectItem value="Used - Good" className="rounded-lg">Used - Good</SelectItem>
                <SelectItem value="Used - Acceptable" className="rounded-lg">Used - Acceptable</SelectItem>
                <SelectItem value="For Parts" className="rounded-lg">For Parts</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quantity" className="text-sm font-medium text-gray-700 mb-1.5 block">
              Quantity <span className="text-red-500">*</span>
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-10 bg-white border-gray-200 hover:border-blue-300 focus:border-blue-400 transition-colors rounded-lg"
              placeholder="1"
              required
            />
          </div>
          <div>
            <Label htmlFor="fob-price" className="text-sm font-medium text-gray-700 mb-1.5 block">
              FOB Price <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fob-price"
              type="number"
              step="0.01"
              placeholder="Enter FOB price"
              value={fobPrice}
              onChange={(e) => setFobPrice(e.target.value)}
              className="h-10 bg-white border-gray-200 hover:border-blue-300 focus:border-blue-400 transition-colors rounded-lg"
              required
            />
          </div>
          <div>
            <Label htmlFor="sku" className="text-sm font-medium text-gray-700 mb-1.5 block">
              SKU (Optional)
            </Label>
            <Input
              id="sku"
              placeholder="Enter product SKU"
              value={skuInput}
              onChange={(e) => setSkuInput(e.target.value)}
              className="h-10 bg-white border-gray-200 hover:border-blue-300 focus:border-blue-400 transition-colors rounded-lg"
            />
          </div>
        </div>

        <div className="mb-6 mt-8">
          <Label htmlFor="item-id-name" className="text-sm font-medium text-gray-700 mb-1.5 block">
            Search by Product Title, ASIN, or UPC/EAN
          </Label>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Input
                id="item-id-name"
                placeholder="Scan or type item identifier"
                value={itemIdNameInput}
                onChange={(e) => setItemIdNameInput(e.target.value)}
                className="relative h-10 bg-white border-gray-200 hover:border-blue-300 focus:border-blue-400 transition-colors rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none h-10 bg-white hover:bg-gray-50 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all"
              onClick={() => router.push("/products/new")}
            >
              <Edit className="mr-2 h-4 w-4" />
              Manual Entry
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none h-10 bg-white hover:bg-gray-50 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all"
              onClick={() => setIsBulkUploadModalOpen(true)}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              Bulk Upload
            </Button>
          </div>
          <Button
            className="w-full sm:w-auto h-10 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg shadow-lg shadow-blue-500/25"
            onClick={handleFindItem}
            disabled={isLoadingApi || !itemIdNameInput.trim() || !quantity.trim() || !fobPrice.trim()}
          >
            {isLoadingApi ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="mr-2 h-4 w-4" />
            )}
            Find Item & Add
          </Button>
        </div>
      </CardContent>

      <ProductSelectionModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        products={modalProducts}
        isLoading={isLoadingApi}
        error={apiError}
        onProductSelect={handleProductSelected}
        searchQuery={itemIdNameInput}
      />
      <BulkUploadModal isOpen={isBulkUploadModalOpen} onOpenChange={setIsBulkUploadModalOpen} />
    </>
  )
}
