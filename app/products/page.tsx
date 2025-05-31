"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type React from "react"
import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import {
  ArrowUpDown,
  Edit3,
  MoreHorizontal,
  PackageSearch,
  Search,
  DollarSign,
  Archive,
  TrendingDownIcon,
  ListFilter,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { ProductBatchEntryForm } from "@/components/products/product-batch-entry-form"
import { BulkUploadModal } from "@/components/products/bulk-upload-modal"
import { AmazonProductSearch } from "@/components/products/amazon-product-search"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface Product {
  id: string
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
}

const initialMockProducts: Product[] = [
  {
    id: "1",
    imageUrl: "/placeholder.svg?height=40&width=40",
    name: "JBL Charge 4 - Waterproof Portable Bluetooth Speaker",
    condition: "New",
    sku: "RYO-JBL-0007",
    location: "A10",
    cost: 102.0,
    priceNew: 0.0,
    sellingPrice: 99.0,
    buybox: true,
    quantity: 3,
    createdDate: "2024-05-15",
    sold: 0,
  },
  {
    id: "2",
    imageUrl: "/placeholder.svg?height=40&width=40",
    name: "Apple AirPods Pro 2 Wireless Earbuds",
    condition: "New",
    sku: "RYO-APP-0006",
    location: "A8",
    cost: 212.0,
    priceNew: 0.0,
    sellingPrice: 199.0,
    buybox: true,
    quantity: 5,
    createdDate: "2024-05-10",
    sold: 12,
  },
  {
    id: "3",
    imageUrl: "/placeholder.svg?height=40&width=40",
    name: "Beats Solo 4 - Wireless Bluetooth On-Ear Headphones",
    condition: "Used - Like New",
    sku: "RYO-BEA-0005",
    location: "B3",
    cost: 123.0,
    priceNew: 0.0,
    sellingPrice: 149.0,
    buybox: false,
    quantity: 1,
    createdDate: "2024-04-20",
    sold: 2,
  },
  {
    id: "4",
    imageUrl: "/placeholder.svg?height=40&width=40",
    name: "Samsung Galaxy Watch 6",
    condition: "New",
    sku: "SAM-WAT-0012",
    location: "C1",
    cost: 250.0,
    priceNew: 0.0,
    sellingPrice: 299.99,
    buybox: true,
    quantity: 10,
    createdDate: "2024-03-01",
    sold: 5,
  },
  {
    id: "5",
    imageUrl: "/placeholder.svg?height=40&width=40",
    name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    condition: "New",
    sku: "SONY-WH-XM5",
    location: "A12",
    cost: 280.0,
    priceNew: 0.0,
    sellingPrice: 349.99,
    buybox: true,
    quantity: 8,
    createdDate: "2024-04-15",
    sold: 3,
  },
  {
    id: "6",
    imageUrl: "/placeholder.svg?height=40&width=40",
    name: "Logitech MX Master 3S Wireless Mouse",
    condition: "New",
    sku: "LOG-MX-MS3S",
    location: "B5",
    cost: 70.0,
    priceNew: 0.0,
    sellingPrice: 99.99,
    buybox: true,
    quantity: 15,
    createdDate: "2024-05-01",
    sold: 7,
  },
  {
    id: "7",
    imageUrl: "/placeholder.svg?height=40&width=40",
    name: "Anker PowerCore 26800 Portable Charger",
    condition: "New",
    sku: "ANK-PC-26800",
    location: "C3",
    cost: 35.0,
    priceNew: 0.0,
    sellingPrice: 49.99,
    buybox: true,
    quantity: 20,
    createdDate: "2024-04-28",
    sold: 15,
  },
  {
    id: "8",
    imageUrl: "/placeholder.svg?height=40&width=40",
    name: "Roku Streaming Stick 4K+",
    condition: "New",
    sku: "ROKU-SS-4KP",
    location: "A5",
    cost: 40.0,
    priceNew: 0.0,
    sellingPrice: 59.99,
    buybox: true,
    quantity: 12,
    createdDate: "2024-05-05",
    sold: 4,
  },
  {
    id: "9",
    imageUrl: "/placeholder.svg?height=40&width=40",
    name: "Kindle Paperwhite (11th Gen)",
    condition: "Used - Good",
    sku: "AMZ-KPW-11",
    location: "B8",
    cost: 80.0,
    priceNew: 0.0,
    sellingPrice: 119.99,
    buybox: false,
    quantity: 3,
    createdDate: "2024-03-15",
    sold: 1,
  },
  {
    id: "10",
    imageUrl: "/placeholder.svg?height=40&width=40",
    name: "GoPro HERO11 Black",
    condition: "New",
    sku: "GP-H11-BLK",
    location: "C7",
    cost: 300.0,
    priceNew: 0.0,
    sellingPrice: 399.99,
    buybox: true,
    quantity: 6,
    createdDate: "2024-04-10",
    sold: 2,
  },
  {
    id: "11",
    imageUrl: "/placeholder.svg?height=40&width=40",
    name: "Nintendo Switch Pro Controller",
    condition: "New",
    sku: "NIN-SW-PRO",
    location: "A3",
    cost: 50.0,
    priceNew: 0.0,
    sellingPrice: 69.99,
    buybox: true,
    quantity: 18,
    createdDate: "2024-05-12",
    sold: 9,
  },
  {
    id: "12",
    imageUrl: "/placeholder.svg?height=40&width=40",
    name: "Bose SoundLink Flex Bluetooth Speaker",
    condition: "New",
    sku: "BOSE-SLF-BT",
    location: "B2",
    cost: 100.0,
    priceNew: 0.0,
    sellingPrice: 149.99,
    buybox: true,
    quantity: 7,
    createdDate: "2024-04-25",
    sold: 3,
  },
  {
    id: "13",
    imageUrl: "/placeholder.svg?height=40&width=40",
    name: "Fitbit Charge 5 Fitness Tracker",
    condition: "New",
    sku: "FIT-CHG-5",
    location: "C9",
    cost: 110.0,
    priceNew: 0.0,
    sellingPrice: 149.95,
    buybox: true,
    quantity: 11,
    createdDate: "2024-05-08",
    sold: 6,
  },
  {
    id: "14",
    imageUrl: "/placeholder.svg?height=40&width=40",
    name: "Echo Dot (5th Gen) Smart Speaker",
    condition: "New",
    sku: "AMZ-ECHO-5",
    location: "A7",
    cost: 30.0,
    priceNew: 0.0,
    sellingPrice: 49.99,
    buybox: true,
    quantity: 25,
    createdDate: "2024-05-03",
    sold: 18,
  },
  {
    id: "15",
    imageUrl: "/placeholder.svg?height=40&width=40",
    name: "iPad Air (5th Generation)",
    condition: "Used - Like New",
    sku: "APL-IPAD-A5",
    location: "B6",
    cost: 450.0,
    priceNew: 0.0,
    sellingPrice: 549.99,
    buybox: false,
    quantity: 2,
    createdDate: "2024-03-20",
    sold: 1,
  },
]

interface InventoryStatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  iconColor?: string
  gradient?: string
  trend?: number
}

function InventoryStatCard({ title, value, icon: Icon, iconColor = "text-primary", gradient = "from-blue-500 to-indigo-500", trend }: InventoryStatCardProps) {
  return (
    <Card className="relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity", gradient)} />
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={cn("p-2.5 bg-gradient-to-br text-white rounded-xl shadow-lg", gradient)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="relative pb-4 px-4">
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          {trend !== undefined && (
            <div className={cn("flex items-center text-sm font-medium", trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-500")}>
              {trend > 0 ? <ArrowUpDown className="w-4 h-4 mr-1 rotate-180" /> : trend < 0 ? <ArrowUpDown className="w-4 h-4 mr-1" /> : null}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialMockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [editingPriceProductId, setEditingPriceProductId] = useState<string | null>(null)
  const [currentEditPrice, setCurrentEditPrice] = useState<string>("")
  const [showPriceConfirmDialog, setShowPriceConfirmDialog] = useState(false)
  const [productForPriceConfirmation, setProductForPriceConfirmation] = useState<Product | null>(null)
  const [newPriceForConfirmation, setNewPriceForConfirmation] = useState<number | null>(null)

  const [editingQuantityProductId, setEditingQuantityProductId] = useState<string | null>(null)
  const [currentEditQuantity, setCurrentEditQuantity] = useState<string>("")
  const [showQuantityConfirmDialog, setShowQuantityConfirmDialog] = useState(false)
  const [productForQuantityConfirmation, setProductForQuantityConfirmation] = useState<Product | null>(null)
  const [newQuantityForConfirmation, setNewQuantityForConfirmation] = useState<number | null>(null)

  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false)
  const [productForDeletion, setProductForDeletion] = useState<Product | null>(null)

  const { toast } = useToast()
  const router = useRouter()

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      // Only select items on current page
      const currentPageProducts = paginatedProducts.map(p => p.id)
      setSelectedProducts(new Set([...selectedProducts, ...currentPageProducts]))
    } else {
      // Deselect items on current page
      const currentPageProducts = new Set(paginatedProducts.map(p => p.id))
      setSelectedProducts(new Set([...selectedProducts].filter(id => !currentPageProducts.has(id))))
    }
  }

  const handleSelectProduct = (productId: string, checked: boolean) => {
    const newSelected = new Set(selectedProducts)
    if (checked) {
      newSelected.add(productId)
    } else {
      newSelected.delete(productId)
    }
    setSelectedProducts(newSelected)
  }

  const handleEditPriceClick = (product: Product) => {
    setEditingPriceProductId(product.id)
    setCurrentEditPrice(product.sellingPrice.toFixed(2))
    setEditingQuantityProductId(null)
  }

  const handleCancelEditPrice = () => {
    setEditingPriceProductId(null)
    setCurrentEditPrice("")
  }

  const handleAttemptSavePrice = () => {
    if (!editingPriceProductId) return
    const productToEdit = products.find((p) => p.id === editingPriceProductId)
    if (!productToEdit) return
    const newPrice = Number.parseFloat(currentEditPrice)
    if (isNaN(newPrice) || newPrice < 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid positive number for the price.",
        variant: "destructive",
      })
      return
    }
    if (newPrice === productToEdit.sellingPrice) {
      handleCancelEditPrice()
      return
    }
    setProductForPriceConfirmation(productToEdit)
    setNewPriceForConfirmation(newPrice)
    setShowPriceConfirmDialog(true)
  }

  const handleConfirmPriceChange = () => {
    if (!productForPriceConfirmation || newPriceForConfirmation === null) return
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productForPriceConfirmation.id ? { ...p, sellingPrice: newPriceForConfirmation } : p,
      ),
    )
    toast({
      title: "Price Updated",
      description: `FOB Price for ${productForPriceConfirmation.name} changed to $${newPriceForConfirmation.toFixed(2)}.`,
    })
    setShowPriceConfirmDialog(false)
    handleCancelEditPrice()
    setProductForPriceConfirmation(null)
    setNewPriceForConfirmation(null)
  }

  const handleEditQuantityClick = (product: Product) => {
    setEditingQuantityProductId(product.id)
    setCurrentEditQuantity(product.quantity.toString())
    setEditingPriceProductId(null)
  }

  const handleCancelEditQuantity = () => {
    setEditingQuantityProductId(null)
    setCurrentEditQuantity("")
  }

  const handleAttemptSaveQuantity = () => {
    if (!editingQuantityProductId) return
    const productToEdit = products.find((p) => p.id === editingQuantityProductId)
    if (!productToEdit) return
    const newQuantity = Number.parseInt(currentEditQuantity, 10)
    if (isNaN(newQuantity) || newQuantity < 0 || !Number.isInteger(newQuantity)) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid non-negative whole number for the quantity.",
        variant: "destructive",
      })
      return
    }
    if (newQuantity === productToEdit.quantity) {
      handleCancelEditQuantity()
      return
    }
    setProductForQuantityConfirmation(productToEdit)
    setNewQuantityForConfirmation(newQuantity)
    setShowQuantityConfirmDialog(true)
  }

  const handleConfirmQuantityChange = () => {
    if (!productForQuantityConfirmation || newQuantityForConfirmation === null) return
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productForQuantityConfirmation.id ? { ...p, quantity: newQuantityForConfirmation } : p,
      ),
    )
    toast({
      title: "Quantity Updated",
      description: `Quantity for ${productForQuantityConfirmation.name} changed to ${newQuantityForConfirmation}.`,
    })
    setShowQuantityConfirmDialog(false)
    handleCancelEditQuantity()
    setProductForQuantityConfirmation(null)
    setNewQuantityForConfirmation(null)
  }

  const handleDeleteProductClick = (product: Product) => {
    setProductForDeletion(product)
    setShowDeleteConfirmDialog(true)
  }

  const handleConfirmDelete = () => {
    if (!productForDeletion) return
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productForDeletion.id))
    toast({
      title: "Product Deleted",
      description: `${productForDeletion.name} has been removed.`,
    })
    setShowDeleteConfirmDialog(false)
    setSelectedProducts((prevSelected) => {
      const newSelected = new Set(prevSelected)
      newSelected.delete(productForDeletion.id)
      return newSelected
    })
    setProductForDeletion(null)
  }

  const handleAmazonProductSelect = (amazonProduct: any) => {
    // Convert Amazon product to local Product format
    const newProduct: Product = {
      id: Date.now().toString(), // Generate a temporary ID
      imageUrl: amazonProduct.image || "/placeholder.svg?height=40&width=40",
      name: amazonProduct.title || amazonProduct.Title || "Unknown Product",
      condition: "New", // Default condition
      sku: `AMZ-${amazonProduct.asin}`, // Generate SKU from ASIN
      location: "TBD", // To be determined
      cost: parseFloat(amazonProduct.price || amazonProduct.OriginalMSRP || "0") * 0.7, // Estimate cost at 70% of MSRP
      priceNew: 0.0,
      sellingPrice: parseFloat(amazonProduct.buybox_data?.buybox_price || amazonProduct.price || amazonProduct.OriginalMSRP || "0"),
      buybox: amazonProduct.buybox_data?.is_amazon_buybox || false,
      quantity: 0, // Default quantity
      createdDate: new Date().toISOString().split('T')[0],
      sold: 0
    }

    // Add to products list
    setProducts(prev => [newProduct, ...prev])
    
    // Show success toast
    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added to your inventory`,
    })
  }

  const handleBatchProductAdd = (productData: {
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
  }) => {
    // Create a new product with a unique ID
    const newProduct: Product = {
      id: Date.now().toString(), // Generate a temporary ID
      ...productData
    }

    // Add to products list
    setProducts(prev => [newProduct, ...prev])
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString + "T00:00:00")
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (e) {
      return dateString
    }
  }

  return (
    <>
      <main className="flex-1 p-6 md:p-8 bg-gray-50/50 overflow-y-auto">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 mt-1">Manage your inventory and product listings</p>
            </div>
          </div>

          <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <PackageSearch className="h-5 w-5 text-blue-500" />
                  Add New Products
                </h2>
              </div>
            </div>
            <ProductBatchEntryForm onProductAdd={handleBatchProductAdd} />
          </Card>

          <div className="flex flex-col md:flex-row items-center gap-4 p-5 bg-white border-0 rounded-xl shadow-lg">
            <div className="relative flex-grow w-full md:max-w-md group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <Input
                type="search"
                placeholder="Search by name or SKU..."
                className="w-full pl-10 pr-3 py-2 h-10 bg-gray-50 border-gray-200 rounded-xl hover:bg-white hover:border-blue-300 focus:bg-white focus:border-blue-400 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 gap-2 bg-white hover:bg-gray-50 border-gray-200 rounded-xl shadow-sm">
                    <ListFilter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-0 p-2">
                  <DropdownMenuLabel className="px-3 py-2">Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator className="mx-2" />
                  <DropdownMenuCheckboxItem className="rounded-lg hover:bg-blue-50 cursor-pointer">Condition</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem className="rounded-lg hover:bg-blue-50 cursor-pointer">Stock Level</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem className="rounded-lg hover:bg-blue-50 cursor-pointer">Created Date</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <InventoryStatCard 
              title="Total Products" 
              value={products.length} 
              icon={PackageSearch}
              gradient="from-blue-500 to-indigo-500"
              trend={12}
            />
            <InventoryStatCard
              title="Total Inventory Value"
              value={`$${products.reduce((sum, p) => sum + p.cost * p.quantity, 0).toLocaleString()}`}
              icon={DollarSign}
              gradient="from-green-500 to-emerald-500"
              trend={8}
            />
            <InventoryStatCard
              title="Items in Stock"
              value={products.reduce((sum, p) => sum + p.quantity, 0)}
              icon={Archive}
              gradient="from-purple-500 to-pink-500"
              trend={-3}
            />
            <InventoryStatCard
              title="Low Stock Items"
              value={products.filter((p) => p.quantity < 2).length}
              icon={TrendingDownIcon}
              gradient="from-red-500 to-rose-500"
              trend={-15}
            />
          </div>

          <Card className="shadow-lg bg-white border-0 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-50 hover:to-gray-100 border-b border-gray-200">
                    <TableHead className="w-[50px] px-4 py-4">
                      <Checkbox
                        checked={
                          paginatedProducts.every(p => selectedProducts.has(p.id)) && paginatedProducts.length > 0
                            ? true
                            : paginatedProducts.some(p => selectedProducts.has(p.id))
                              ? "indeterminate"
                              : false
                        }
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all rows"
                        className="border-gray-300"
                      />
                    </TableHead>
                    <TableHead className="w-[70px] px-4 py-4 text-sm text-gray-700 font-semibold">Image</TableHead>
                    <TableHead className="min-w-[280px] px-4 py-4 text-sm text-gray-700 font-semibold">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto text-sm -ml-1 font-semibold text-gray-700 hover:bg-transparent hover:text-blue-600"
                      >
                        Title / Details
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[130px] px-4 py-4 text-sm text-gray-700 font-semibold">FOB Price</TableHead>
                    <TableHead className="w-[110px] px-4 py-4 text-sm text-gray-700 font-semibold text-right">
                      Quantity
                    </TableHead>
                    <TableHead className="w-[120px] px-4 py-4 text-sm text-gray-700 font-semibold text-right">
                      Created Date
                    </TableHead>
                    <TableHead className="w-[60px] px-4 py-4 text-sm text-gray-700 font-semibold text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product, index) => (
                      <TableRow
                        key={product.id}
                        data-state={selectedProducts.has(product.id) ? "selected" : ""}
                        className={cn(
                          "border-b border-gray-100 transition-all duration-200",
                          selectedProducts.has(product.id) 
                            ? "bg-blue-50" 
                            : "hover:bg-gray-50"
                        )}
                      >
                        <TableCell className="px-4 py-3">
                          <Checkbox
                            checked={selectedProducts.has(product.id)}
                            onCheckedChange={(checked) => handleSelectProduct(product.id, !!checked)}
                            aria-label={`Select row ${product.id}`}
                            className="border-gray-300"
                          />
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="relative overflow-hidden rounded-lg">
                            <img
                              src={product.imageUrl || "/placeholder.svg"}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 align-top">
                          <div className="font-medium text-sm text-gray-900 hover:text-blue-600 transition-colors">
                            <Link href={`/products/${product.id}`}>{product.name}</Link>
                          </div>
                          <div className="text-xs text-gray-500 space-y-1 mt-1">
                            <p className="flex items-center gap-1">
                              <span className="inline-block w-16">Condition:</span>
                              <span className="font-medium text-gray-700">{product.condition}</span>
                            </p>
                            <p className="flex items-center gap-1">
                              <span className="inline-block w-16">SKU:</span>
                              <span className="font-medium text-gray-700">{product.sku}</span>
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 align-top">
                          {editingPriceProductId === product.id ? (
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-gray-500 mr-1">$</span>
                              <Input
                                type="number"
                                value={currentEditPrice}
                                onChange={(e) => setCurrentEditPrice(e.target.value)}
                                className="h-8 w-20 text-sm px-2 border-blue-300 focus:border-blue-500"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleAttemptSavePrice()
                                  if (e.key === "Escape") handleCancelEditPrice()
                                }}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-green-600 hover:bg-green-100 rounded-lg"
                                onClick={handleAttemptSavePrice}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-600 hover:bg-red-100 rounded-lg"
                                onClick={handleCancelEditPrice}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-start gap-2">
                              <span className="font-medium text-sm text-foreground">
                                ${product.sellingPrice.toFixed(2)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-primary opacity-50 hover:opacity-100"
                                onClick={() => handleEditPriceClick(product)}
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 align-top text-right">
                          {editingQuantityProductId === product.id ? (
                            <div className="flex items-center justify-end gap-1">
                              <Input
                                type="number"
                                value={currentEditQuantity}
                                onChange={(e) => setCurrentEditQuantity(e.target.value)}
                                className="h-8 w-16 text-sm px-2 text-right"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleAttemptSaveQuantity()
                                  if (e.key === "Escape") handleCancelEditQuantity()
                                }}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-green-600 hover:bg-green-100"
                                onClick={handleAttemptSaveQuantity}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-600 hover:bg-red-100"
                                onClick={handleCancelEditQuantity}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end">
                              <span className="font-medium text-sm text-foreground">{product.quantity}</span>
                              <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 ml-1 text-muted-foreground hover:text-primary"
                                      onClick={() => handleEditQuantityClick(product)}
                                    >
                                      <Edit3 className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="text-xs p-1.5">Edit Quantity</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 align-top text-right text-sm text-muted-foreground">
                          {formatDate(product.createdDate)}
                        </TableCell>
                        <TableCell className="px-4 py-3 align-top text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="text-xs">
                              <DropdownMenuItem onClick={() => router.push(`/products/${product.id}`)}>Edit Product</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 hover:!text-red-600 hover:!bg-red-50"
                                onClick={() => handleDeleteProductClick(product)}
                              >
                                Delete Product
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No products found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Card className="bg-white border-0 shadow-lg rounded-xl p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                  </p>
                  <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                    setItemsPerPage(parseInt(value))
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="w-20 h-9 bg-white border-gray-200 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-xl border-0">
                      <SelectItem value="5" className="rounded-lg">5</SelectItem>
                      <SelectItem value="10" className="rounded-lg">10</SelectItem>
                      <SelectItem value="20" className="rounded-lg">20</SelectItem>
                      <SelectItem value="50" className="rounded-lg">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600">per page</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="h-9 w-9 bg-white hover:bg-gray-50 border-gray-200 rounded-lg"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-9 w-9 bg-white hover:bg-gray-50 border-gray-200 rounded-lg"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={i}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="icon"
                          onClick={() => setCurrentPage(pageNumber)}
                          className={cn(
                            "h-9 w-9 rounded-lg",
                            currentPage === pageNumber
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 shadow-lg shadow-blue-500/25"
                              : "bg-white hover:bg-gray-50 border-gray-200"
                          )}
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 bg-white hover:bg-gray-50 border-gray-200 rounded-lg"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 bg-white hover:bg-gray-50 border-gray-200 rounded-lg"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>

      <BulkUploadModal isOpen={isBulkUploadModalOpen} onOpenChange={setIsBulkUploadModalOpen} />

      {productForPriceConfirmation && newPriceForConfirmation !== null && (
        <AlertDialog open={showPriceConfirmDialog} onOpenChange={setShowPriceConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Price Change</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to change the FOB Price for
                <span className="font-semibold"> {productForPriceConfirmation.name} </span>
                from
                <span className="font-semibold"> ${productForPriceConfirmation.sellingPrice.toFixed(2)} </span>
                to
                <span className="font-semibold"> ${newPriceForConfirmation.toFixed(2)}</span>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setShowPriceConfirmDialog(false)
                  setProductForPriceConfirmation(null)
                  setNewPriceForConfirmation(null)
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmPriceChange}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {productForQuantityConfirmation && newQuantityForConfirmation !== null && (
        <AlertDialog open={showQuantityConfirmDialog} onOpenChange={setShowQuantityConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Quantity Change</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to change the Quantity for
                <span className="font-semibold"> {productForQuantityConfirmation.name} </span>
                from
                <span className="font-semibold"> {productForQuantityConfirmation.quantity} </span>
                to
                <span className="font-semibold"> {newQuantityForConfirmation}</span>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setShowQuantityConfirmDialog(false)
                  setProductForQuantityConfirmation(null)
                  setNewQuantityForConfirmation(null)
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmQuantityChange}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {productForDeletion && (
        <AlertDialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the product:
                <span className="font-semibold"> {productForDeletion.name}</span>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setShowDeleteConfirmDialog(false)
                  setProductForDeletion(null)
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
