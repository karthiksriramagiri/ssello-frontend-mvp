"use client"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, PackageSearch, X } from "lucide-react"
import type { SPProduct } from "@/lib/mock-sp-api"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ProductSelectionModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  products: SPProduct[]
  isLoading: boolean
  error?: string | null
  onProductSelect: (product: SPProduct) => void
  searchQuery: string
}

export function ProductSelectionModal({
  isOpen,
  onOpenChange,
  products,
  isLoading,
  error,
  onProductSelect,
  searchQuery,
}: ProductSelectionModalProps) {
  const [selectedProductInModal, setSelectedProductInModal] = useState<SPProduct | null>(null)

  const handleSelectAndClose = () => {
    if (selectedProductInModal) {
      onProductSelect(selectedProductInModal)
      onOpenChange(false)
      setSelectedProductInModal(null) // Reset selection for next open
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedProductInModal(null) // Reset selection when closing
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b relative">
          <DialogTitle className="text-xl font-semibold">Select a Product</DialogTitle>
          <DialogDescription>
            Select a product to import details automatically.
            {searchQuery && (
              <span className="block text-xs mt-1">
                Results for: <span className="font-medium">{searchQuery}</span>
              </span>
            )}
          </DialogDescription>
          <DialogClose asChild className="absolute right-4 top-4">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>

        <ScrollArea className="flex-grow px-6 py-2">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64">
              <PackageSearch className="h-16 w-16 text-muted-foreground animate-pulse mb-4" />
              <p className="text-muted-foreground">Searching for products...</p>
            </div>
          )}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center h-64 text-destructive">
              <AlertCircle className="h-16 w-16 mb-4" />
              <p className="font-semibold">Error fetching products</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!isLoading && !error && products.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64">
              <PackageSearch className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No products found for your query.</p>
              <p className="text-sm text-muted-foreground">Try refining your search terms.</p>
            </div>
          )}
          {!isLoading && !error && products.length > 0 && (
            <div className="space-y-0">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={cn(
                    "flex items-start gap-4 p-3 border-b cursor-pointer hover:bg-slate-50",
                    selectedProductInModal?.id === product.id && "bg-primary/10 border-l-2 border-l-primary",
                  )}
                  onClick={() => setSelectedProductInModal(product)}
                >
                  <img
                    src={product.imageUrl || "/placeholder.svg?height=60&width=60"}
                    alt={product.title}
                    className="w-16 h-16 object-contain rounded border bg-white flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium text-foreground mb-1.5 line-clamp-2">{product.title}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="text-xs font-normal">
                        ASIN: {product.asin}
                      </Badge>
                      {product.upc && (
                        <Badge variant="secondary" className="text-xs font-normal">
                          UPC: {product.upc}
                        </Badge>
                      )}
                      {product.category && (
                        <Badge variant="secondary" className="text-xs font-normal">
                          Category: {product.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="p-4 border-t sm:justify-end gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSelectAndClose} disabled={!selectedProductInModal || isLoading}>
            Select Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
