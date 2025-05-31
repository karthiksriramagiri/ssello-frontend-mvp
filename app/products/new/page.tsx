"use client"

import { useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation" // Added for navigation
import { useToast } from "@/hooks/use-toast" // Added for toast notifications
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

export default function AddNewProductPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [openAccordions, setOpenAccordions] = useState<string[]>(["product-details"])
  const [sku, setSku] = useState("")
  const [barcode, setBarcode] = useState("")
  const [title, setTitle] = useState("")
  const [itemCondition, setItemCondition] = useState("new")
  const [fobPrice, setFobPrice] = useState("")
  const [category, setCategory] = useState("general-merchandise")
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
    // Gather all form data
    const productData = {
      sku,
      barcode,
      title,
      itemCondition,
      fobPrice,
      category,
      description,
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
      images: uploadedImages.map((img) => ({ name: img.name, size: img.size })), // Example: just names and sizes
    }

    console.log("Saving Product:", productData)
    // Here you would typically send this data to your backend API

    toast({
      title: "Product Saved (Simulated)",
      description: `${title || "New Product"} has been saved.`,
    })

    // Optionally, redirect or clear form
    // router.push("/products");
    // Or clearForm();
  }

  return (
    <main className="flex-1 flex flex-col p-4 md:p-6 gap-4 md:gap-6 bg-slate-50 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Add New Item</h1>
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
                      placeholder="Optional, auto-generated if empty"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Optional, enter only if you don&apos;t want the system to auto-generate one.
                    </p>
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
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="used-like-new">Used - Like New</SelectItem>
                        <SelectItem value="used-good">Used - Good</SelectItem>
                        <SelectItem value="used-acceptable">Used - Acceptable</SelectItem>
                        <SelectItem value="for-parts">For Parts</SelectItem>
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
                    Upload Images
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
                              <SelectItem value="cm">cm</SelectItem>
                              <SelectItem value="ft">ft</SelectItem>
                              <SelectItem value="mm">mm</SelectItem>
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
                              <SelectItem value="cm">cm</SelectItem>
                              <SelectItem value="ft">ft</SelectItem>
                              <SelectItem value="mm">mm</SelectItem>
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

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSaveProduct}>Save Product</Button>
      </div>
    </main>
  )
}
