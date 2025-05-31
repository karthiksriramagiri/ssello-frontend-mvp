"use client"

import { useState, useEffect, type ChangeEvent } from "react"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  ImageIcon,
  Video,
  Sparkles,
  UploadCloud,
  Trash2,
  ArrowLeft,
} from "lucide-react"

const RichTextEditorToolbar = ({ aiActionText = "AI Rephrase" }: { aiActionText?: string }) => (
  <div className="flex items-center justify-between gap-2 p-2 border-b bg-slate-50 rounded-t-md">
    <div className="flex items-center gap-1">
      {[Bold, Italic, Underline, List, ListOrdered, Link2, ImageIcon, Video].map((Icon, idx) => (
        <Button key={idx} variant="ghost" size="icon" className="h-7 w-7">
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
    <Button variant="outline" size="sm" className="h-7 text-xs bg-white">
      <Sparkles className="mr-1.5 h-3.5 w-3.5 text-purple-500" />
      {aiActionText}
    </Button>
  </div>
)

interface ImagePreview {
  id: string
  name: string
  url: string
  size: number
}

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

// Mock data - in a real app, this would come from API/database
const mockProducts: Product[] = [
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

const categoryMapping: Record<string, string> = {
  "General Merchandise": "general-merchandise",
  "Electronics": "electronics",
  "Apparel": "apparel",
  "Home Goods": "home-goods",
  "Toys & Games": "toys-and-games",
}

const conditionMapping: Record<string, string> = {
  "New": "New",
  "Used - Like New": "Used - Like New",
  "Used - Good": "Used - Good",
  "Used - Acceptable": "Used - Acceptable",
  "For Parts": "For Parts",
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const productId = params.id as string

  const [openAccordions, setOpenAccordions] = useState<string[]>(["product-details"])
  const [sku, setSku] = useState("")
  const [barcode, setBarcode] = useState("")
  const [title, setTitle] = useState("")
  const [itemCondition, setItemCondition] = useState("New")
  const [fobPrice, setFobPrice] = useState("")
  const [category, setCategory] = useState("electronics")
  const [description, setDescription] = useState("")
  const [productWeight, setProductWeight] = useState("")
  const [productWeightUnit, setProductWeightUnit] = useState("lb")
  const [productLength, setProductLength] = useState("")
  const [productWidth, setProductWidth] = useState("")
  const [productHeight, setProductHeight] = useState("")
  const [productDimensionUnit, setProductDimensionUnit] = useState("in")
  const [packageWeight, setPackageWeight] = useState("")
  const [packageWeightUnit, setPackageWeightUnit] = useState("lb")
  const [packageLength, setPackageLength] = useState("")
  const [packageWidth, setPackageWidth] = useState("")
  const [packageHeight, setPackageHeight] = useState("")
  const [packageDimensionUnit, setPackageDimensionUnit] = useState("in")
  const [uploadedImages, setUploadedImages] = useState<ImagePreview[]>([])
  const [quantity, setQuantity] = useState("")

  // Load product data on component mount
  useEffect(() => {
    // In a real app, you'd fetch the product data from your API
    const product = mockProducts.find(p => p.id === productId)
    
    if (product) {
      // Basic product info
      setSku(product.sku)
      setTitle(product.name)
      setItemCondition(product.condition)
      setFobPrice(product.sellingPrice.toString())
      setQuantity(product.quantity.toString())
      
      // Set barcode if available (you might get this from API payload)
      // For now, we'll check if the SKU contains patterns that might indicate barcode info
      if (product.sku && product.sku.includes('AMZ-')) {
        // Extract potential ASIN from SKU pattern like AMZ-B08N5WRWNW
        const asinMatch = product.sku.match(/AMZ-([A-Z0-9]{10})/)
        if (asinMatch) {
          setBarcode(asinMatch[1])
        }
      }
      
      // Enhanced category detection based on product name and potential API data
      const productName = product.name.toLowerCase()
      if (productName.includes('speaker') || 
          productName.includes('bluetooth') ||
          productName.includes('headphone') ||
          productName.includes('earbuds') ||
          productName.includes('airpods') ||
          productName.includes('beats') ||
          productName.includes('sony') ||
          productName.includes('jbl') ||
          productName.includes('bose') ||
          productName.includes('watch') ||
          productName.includes('electronic') ||
          productName.includes('mouse') ||
          productName.includes('charger') ||
          productName.includes('roku') ||
          productName.includes('gopro') ||
          productName.includes('nintendo') ||
          productName.includes('controller') ||
          productName.includes('fitbit')) {
        setCategory("electronics")
      } else if (productName.includes('kindle') ||
                 productName.includes('book') ||
                 productName.includes('ipad') ||
                 productName.includes('tablet')) {
        setCategory("electronics")
      } else if (productName.includes('toy') ||
                 productName.includes('game') ||
                 productName.includes('play')) {
        setCategory("toys-and-games")
      } else if (productName.includes('apparel') ||
                 productName.includes('clothing') ||
                 productName.includes('shirt') ||
                 productName.includes('pants')) {
        setCategory("apparel")
      } else if (productName.includes('home') ||
                 productName.includes('kitchen') ||
                 productName.includes('furniture')) {
        setCategory("home-goods")
      } else {
        setCategory("general-merchandise")
      }
      
      // Generate a comprehensive description based on the product
      let desc = `${product.name} in ${product.condition} condition.`
      desc += `\n\nProduct Details:`
      desc += `\n• SKU: ${product.sku}`
      desc += `\n• Condition: ${product.condition}`
      desc += `\n• Selling Price: $${product.sellingPrice.toFixed(2)}`
      if (product.cost > 0) {
        desc += `\n• Cost: $${product.cost.toFixed(2)}`
      }
      if (product.priceNew > 0) {
        desc += `\n• List Price: $${product.priceNew.toFixed(2)}`
      }
      desc += `\n• Quantity Available: ${product.quantity}`
      desc += `\n• Buy Box Status: ${product.buybox ? 'Active' : 'Inactive'}`
      if (product.sold > 0) {
        desc += `\n• Units Sold: ${product.sold}`
      }
      desc += `\n• Listed Date: ${product.createdDate}`
      
      setDescription(desc)
      
      // Set estimated product weight based on category for better defaults
      if (productName.includes('headphone') || productName.includes('airpods') || productName.includes('earbuds')) {
        setProductWeight("0.5")
        setProductLength("8")
        setProductWidth("6")
        setProductHeight("3")
      } else if (productName.includes('speaker') || productName.includes('jbl') || productName.includes('bose')) {
        setProductWeight("2.0")
        setProductLength("10")
        setProductWidth("4")
        setProductHeight("4")
      } else if (productName.includes('watch')) {
        setProductWeight("0.3")
        setProductLength("2")
        setProductWidth("2")
        setProductHeight("1")
      } else if (productName.includes('mouse')) {
        setProductWeight("0.2")
        setProductLength("5")
        setProductWidth("3")
        setProductHeight("2")
      } else if (productName.includes('charger') || productName.includes('powercore')) {
        setProductWeight("1.0")
        setProductLength("6")
        setProductWidth("3")
        setProductHeight("1")
      } else if (productName.includes('kindle') || productName.includes('tablet') || productName.includes('ipad')) {
        setProductWeight("1.5")
        setProductLength("10")
        setProductWidth("7")
        setProductHeight("0.5")
      } else {
        // Default for electronics
        setProductWeight("1.0")
        setProductLength("8")
        setProductWidth("6")
        setProductHeight("3")
      }
      
      // Set package dimensions (typically slightly larger than product)
      const prodLength = parseFloat(productLength) || 8
      const prodWidth = parseFloat(productWidth) || 6  
      const prodHeight = parseFloat(productHeight) || 3
      const prodWeight = parseFloat(productWeight) || 1.0
      
      setPackageLength((prodLength + 2).toString())
      setPackageWidth((prodWidth + 2).toString())
      setPackageHeight((prodHeight + 1).toString())
      setPackageWeight((prodWeight + 0.2).toString())
      
      // If there's an existing image, add it to uploadedImages
      if (product.imageUrl && product.imageUrl !== "/placeholder.svg?height=40&width=40") {
        setUploadedImages([{
          id: "existing-image",
          name: `${product.name.slice(0, 30)}...jpg`,
          url: product.imageUrl,
          size: 0
        }])
      }
    }
  }, [productId])

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages: ImagePreview[] = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
      }))
      setUploadedImages((prevImages) => [...prevImages, ...newImages])
    }
  }

  const removeImage = (id: string) => {
    setUploadedImages((prevImages) => prevImages.filter((img) => img.id !== id))
  }

  const toggleAll = (expand: boolean) => {
    if (expand) {
      setOpenAccordions(["product-details", "images-section", "shipping-details"])
    } else {
      setOpenAccordions([])
    }
  }

  const handleCancel = () => {
    router.push("/products")
  }

  const handleSaveProduct = () => {
    const productData = {
      id: productId,
      sku,
      barcode,
      title,
      itemCondition,
      fobPrice: parseFloat(fobPrice),
      category,
      description,
      quantity: parseInt(quantity),
      productWeight,
      productWeightUnit,
      productDimensions: {
        length: productLength,
        width: productWidth,
        height: productHeight,
        unit: productDimensionUnit,
      },
      packageWeight,
      packageWeightUnit,
      packageDimensions: {
        length: packageLength,
        width: packageWidth,
        height: packageHeight,
        unit: packageDimensionUnit,
      },
      images: uploadedImages.map((img) => ({ name: img.name, size: img.size })),
    }

    console.log("Updating Product:", productData)

    toast({
      title: "Product Updated",
      description: `${title || "Product"} has been updated successfully.`,
    })

    router.push("/products")
  }

  return (
    <main className="flex-1 flex flex-col p-4 md:p-6 gap-4 md:gap-6 bg-slate-50 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">Edit Product</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toggleAll(true)}>
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={() => toggleAll(false)}>
            Collapse All
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Accordion type="multiple" value={openAccordions} onValueChange={setOpenAccordions} className="w-full">
            {/* Product Details Section */}
            <AccordionItem value="product-details">
              <AccordionTrigger className="px-6 py-4 text-base font-medium hover:no-underline">
                Product Details
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <Label htmlFor="sku" className="text-sm">
                      SKU
                    </Label>
                    <Input
                      id="sku"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="mt-1"
                      placeholder="Enter SKU"
                    />
                  </div>
                  <div>
                    <Label htmlFor="barcode" className="text-sm">
                      Barcode
                    </Label>
                    <Input
                      id="barcode"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      className="mt-1"
                      placeholder="Enter UPC, ISBN or GTIN"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title" className="text-sm">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1"
                      placeholder="Enter product title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="itemCondition" className="text-sm">
                      Item Condition
                    </Label>
                    <Select value={itemCondition} onValueChange={setItemCondition}>
                      <SelectTrigger id="itemCondition" className="mt-1">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Used - Like New">Used - Like New</SelectItem>
                        <SelectItem value="Used - Good">Used - Good</SelectItem>
                        <SelectItem value="Used - Acceptable">Used - Acceptable</SelectItem>
                        <SelectItem value="For Parts">For Parts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fobPrice" className="text-sm">
                      FOB Price
                    </Label>
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">$</span>
                      <Input
                        id="fobPrice"
                        type="number"
                        value={fobPrice}
                        onChange={(e) => setFobPrice(e.target.value)}
                        className="pl-7"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="quantity" className="text-sm">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="mt-1"
                      placeholder="0"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="category" className="text-sm">
                      Category
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category" className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general-merchandise">General Merchandise</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="apparel">Apparel</SelectItem>
                        <SelectItem value="home-goods">Home Goods</SelectItem>
                        <SelectItem value="toys-and-games">Toys & Games</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description" className="text-sm">
                      Description
                    </Label>
                    <div className="mt-1 border rounded-md">
                      <RichTextEditorToolbar />
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter detailed product description..."
                        className="min-h-[120px] rounded-t-none border-0 focus-visible:ring-0"
                      />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Images Section */}
            <AccordionItem value="images-section">
              <AccordionTrigger className="px-6 py-4 text-base font-medium hover:no-underline">Images</AccordionTrigger>
              <AccordionContent className="px-6 pb-6 border-t pt-6">
                <div className="border rounded-md p-4 min-h-[150px] flex flex-col items-center justify-center bg-slate-50/50">
                  {uploadedImages.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No images uploaded</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
                      {uploadedImages.map((image) => (
                        <div key={image.id} className="relative group aspect-square border rounded-md overflow-hidden">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={image.name}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(image.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Label htmlFor="imageUpload" className="text-sm font-medium">
                    Upload Additional Images
                  </Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="flex text-sm text-muted-foreground">
                        <label
                          htmlFor="imageUploadInput"
                          className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                        >
                          <span>Choose Files</span>
                          <input
                            id="imageUploadInput"
                            name="imageUploadInput"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Shipping Details Section */}
            <AccordionItem value="shipping-details">
              <AccordionTrigger className="px-6 py-4 text-base font-medium hover:no-underline">
                Shipping Details
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 border-t pt-6">
                <div className="space-y-6">
                  {/* Product Weight & Dimensions */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 text-foreground">Product</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <Label htmlFor="productWeight" className="text-sm">
                          Weight
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="productWeight"
                            type="number"
                            value={productWeight}
                            onChange={(e) => setProductWeight(e.target.value)}
                            placeholder="0.00"
                            className="flex-grow"
                          />
                          <Select value={productWeightUnit} onValueChange={setProductWeightUnit}>
                            <SelectTrigger className="w-[80px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lb">lb</SelectItem>
                              <SelectItem value="oz">oz</SelectItem>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="g">g</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">Dimensions (L x W x H)</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="productLength"
                            type="number"
                            value={productLength}
                            onChange={(e) => setProductLength(e.target.value)}
                            placeholder="L"
                            className="flex-grow"
                          />
                          <Input
                            id="productWidth"
                            type="number"
                            value={productWidth}
                            onChange={(e) => setProductWidth(e.target.value)}
                            placeholder="W"
                            className="flex-grow"
                          />
                          <Input
                            id="productHeight"
                            type="number"
                            value={productHeight}
                            onChange={(e) => setProductHeight(e.target.value)}
                            placeholder="H"
                            className="flex-grow"
                          />
                          <Select value={productDimensionUnit} onValueChange={setProductDimensionUnit}>
                            <SelectTrigger className="w-[80px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="in">in</SelectItem>
                              <SelectItem value="ft">ft</SelectItem>
                              <SelectItem value="cm">cm</SelectItem>
                              <SelectItem value="m">m</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Package Weight & Dimensions */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 text-foreground">Package</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <Label htmlFor="packageWeight" className="text-sm">
                          Weight
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="packageWeight"
                            type="number"
                            value={packageWeight}
                            onChange={(e) => setPackageWeight(e.target.value)}
                            placeholder="0.00"
                            className="flex-grow"
                          />
                          <Select value={packageWeightUnit} onValueChange={setPackageWeightUnit}>
                            <SelectTrigger className="w-[80px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lb">lb</SelectItem>
                              <SelectItem value="oz">oz</SelectItem>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="g">g</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">Dimensions (L x W x H)</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="packageLength"
                            type="number"
                            value={packageLength}
                            onChange={(e) => setPackageLength(e.target.value)}
                            placeholder="L"
                            className="flex-grow"
                          />
                          <Input
                            id="packageWidth"
                            type="number"
                            value={packageWidth}
                            onChange={(e) => setPackageWidth(e.target.value)}
                            placeholder="W"
                            className="flex-grow"
                          />
                          <Input
                            id="packageHeight"
                            type="number"
                            value={packageHeight}
                            onChange={(e) => setPackageHeight(e.target.value)}
                            placeholder="H"
                            className="flex-grow"
                          />
                          <Select value={packageDimensionUnit} onValueChange={setPackageDimensionUnit}>
                            <SelectTrigger className="w-[80px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="in">in</SelectItem>
                              <SelectItem value="ft">ft</SelectItem>
                              <SelectItem value="cm">cm</SelectItem>
                              <SelectItem value="m">m</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pb-6">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSaveProduct} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
          Update Product
        </Button>
      </div>
    </main>
  )
} 