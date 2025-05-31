"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import { ArrowUpRight, PackageSearch } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProductRowProps {
  name: string
  sku: string
  price: string
  sales: number
  stock: number
}

function ProductRow({ name, sku, price, sales, stock }: ProductRowProps) {
  return (
    <div className="grid grid-cols-12 gap-2 py-2.5 border-b last:border-0 items-center text-xs hover:bg-orange-50/50 transition-colors">
      <div className="col-span-5">
        <p className="font-medium truncate text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">SKU: {sku}</p>
      </div>
      <div className="col-span-2 text-right text-foreground font-medium">{price}</div>
      <div className="col-span-2 text-right text-foreground">{sales}</div>
      <div className="col-span-3 text-right flex items-center justify-end gap-1">
        <Badge
          variant={stock > 0 ? "outline" : "destructive"}
          className={cn(
            "h-5 px-1.5 text-[10px] font-normal", // Smaller badge
            stock > 0 ? "border-green-400 text-green-700 bg-green-50" : "border-red-400 text-red-700 bg-red-50",
          )}
        >
          {stock > 0 ? `${stock} in stock` : "Out of stock"}
        </Badge>
      </div>
    </div>
  )
}

export function TopProducts() {
  const [products, setProducts] = useState<ProductRowProps[]>([
    // Sample data for better visual
    { name: "Premium Wireless Headphones", sku: "NOC-HP-001", price: "$99.99", sales: 150, stock: 35 },
    { name: "Smart Coffee Mug - Orange Edition", sku: "NOC-MUG-003", price: "$29.50", sales: 230, stock: 0 },
    { name: "Ergonomic Office Chair", sku: "NOC-CHR-007", price: "$249.00", sales: 75, stock: 12 },
  ])

  return (
    <Card className="hover:shadow-lg transition-shadow bg-card h-full flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-foreground text-lg">Top Products</CardTitle>
          <CardDescription className="text-sm">Your best-selling items at a glance.</CardDescription>
        </div>
        <Button variant="link" size="sm" className="gap-1 text-xs text-primary hover:text-primary/80 h-8">
          View all
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-1 pb-2 px-3">
        {" "}
        {/* Reduced padding */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-12 gap-2 py-1.5 text-[11px] font-semibold text-muted-foreground px-1">
              <div className="col-span-5">Product</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Sales</div>
              <div className="col-span-3 text-right">Stock</div>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[180px] pr-1">
              {" "}
              {/* Max height and internal scroll */}
              {products.map((product, i) => (
                <ProductRow key={i} {...product} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-6">
            <PackageSearch className="w-12 h-12 text-orange-300 mb-3" />
            <p className="text-sm text-muted-foreground mb-1">No top products yet.</p>
            <p className="text-xs text-muted-foreground">Start selling to see your stars!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
