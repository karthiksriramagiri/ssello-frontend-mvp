"use client"
import { Label } from "@/components/ui/label"
import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import {
  ChevronDown,
  FileText,
  MoreHorizontal,
  Printer,
  Search,
  Ship,
  Tag,
  User,
  ShoppingCart,
  AlertTriangle,
  PackageIcon,
  Store,
  Edit2,
  PlusCircle,
  Truck,
  CheckCircle2,
  Clock,
  DollarSign,
  ArrowUpRight,
} from "lucide-react"
import type { DateRange } from "react-day-picker" // Import DateRange

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Remove DatePicker import if no longer used elsewhere, for now we keep it as it might be used by other components.
// import { DatePicker } from "@/components/ui/date-picker"
import { DateRangePicker } from "@/components/ui/date-range-picker" // Import DateRangePicker
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { Package } from "lucide-react"

interface CancelOrderModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  order: Order | null
  onConfirmCancellation: (orderId: string, reason: string, customReason?: string) => void
}

function CancelOrderModal({ isOpen, onOpenChange, order, onConfirmCancellation }: CancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const [customReason, setCustomReason] = useState("")

  useEffect(() => {
    if (isOpen) {
      setSelectedReason("")
      setCustomReason("")
    }
  }, [isOpen])

  const handleConfirm = () => {
    if (order && selectedReason) {
      if (selectedReason === "Other" && !customReason.trim()) {
        alert("Please provide a reason if 'Other' is selected.")
        return
      }
      onConfirmCancellation(order.id, selectedReason, selectedReason === "Other" ? customReason.trim() : undefined)
      onOpenChange(false)
    }
  }

  if (!order) return null

  const cancellationReasons = [
    "Out of Stock",
    "Defective Order",
    "Incorrect Item Shipped",
    "Incorrect/Misleading Product",
    "Other",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Order: {order.orderId}</DialogTitle>
          <DialogDescription>
            Please select a reason for cancelling this order. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>Cancelling this order may negatively impact your Seller Pulse score.</AlertDescription>
        </Alert>

        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="cancelReasonSelect" className="text-sm font-medium">
              Reason for Cancellation
            </Label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger id="cancelReasonSelect" className="mt-1">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {cancellationReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedReason === "Other" && (
            <div>
              <Label htmlFor="customReason" className="text-sm font-medium">
                Please specify reason
              </Label>
              <Textarea
                id="customReason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter your reason for cancellation"
                className="mt-1 min-h-[80px]"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Back
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={!selectedReason || (selectedReason === "Other" && !customReason.trim())}
          >
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface OrderProduct {
  name: string
  price: number
  quantity: number
  sku: string
  imageUrl?: string
}

interface Marketplace {
  name: string
  countryCode: string
  logoUrl?: string
}

interface CarrierInfo {
  id: string
  name: string
}

interface Order {
  id: string
  orderId: string
  date: string
  slaDate: string
  slaStatus: "on-time" | "delayed" | "at-risk"
  products: OrderProduct[]
  customer: {
    name: string
    deliveryAddress: string
    country: string
    countryCode?: string
  }
  marketplace: Marketplace
  status: "Dispatch pending" | "In process" | "Validating Tracking" | "Shipped" | "Delivered" | "Cancelled"
  trackingCode?: string
  carrier?: CarrierInfo
  locationName: string
  labelUrl?: string
  totalAmount: number
}

const generateRandomOrderId = () => "ORD" + Math.floor(1000000 + Math.random() * 9000000)
const usWarehouseLocations = ["Atlanta", "Miami", "San Antonio", "Washington", "Los Angeles"]

const marketplaces: Marketplace[] = [
  { name: "Mercado Livre", countryCode: "BR", logoUrl: "/logos/mercado-libre.png" },
  { name: "Mercado Livre", countryCode: "AR", logoUrl: "/logos/mercado-libre.png" },
  { name: "Mercado Livre", countryCode: "MX", logoUrl: "/logos/mercado-libre.png" },
  { name: "Mercado Livre", countryCode: "CO", logoUrl: "/logos/mercado-libre.png" },
  { name: "Mercado Livre", countryCode: "CL", logoUrl: "/logos/mercado-libre.png" },
  { name: "Amazon", countryCode: "US", logoUrl: "/logos/amazon.png" },
  { name: "Amazon", countryCode: "MX", logoUrl: "/logos/amazon.png" },
  { name: "Amazon", countryCode: "CA", logoUrl: "/logos/amazon.png" },
  { name: "Coppel", countryCode: "MX", logoUrl: "/logos/coppel.png" },
  { name: "Walmart", countryCode: "MX", logoUrl: "/logos/walmart.png" },
  { name: "Walmart", countryCode: "US", logoUrl: "/logos/walmart.png" },
  { name: "Shopee", countryCode: "BR", logoUrl: "/placeholder.svg?height=20&width=80" },
  { name: "Magazine Luiza", countryCode: "BR", logoUrl: "/placeholder.svg?height=20&width=80" },
  { name: "Americanas", countryCode: "BR", logoUrl: "/placeholder.svg?height=20&width=80" },
  { name: "eBay", countryCode: "US", logoUrl: "/placeholder.svg?height=20&width=80" },
]

const carrierOptions: CarrierInfo[] = [
  { id: "fedex", name: "FedEx" },
  { id: "ups", name: "UPS" },
  { id: "dhl", name: "DHL Express" },
  { id: "usps", name: "USPS" },
  { id: "canada-post", name: "Canada Post" },
  { id: "purolator", name: "Purolator" },
  { id: "royal-mail", name: "Royal Mail" },
  { id: "parcelforce", name: "Parcelforce" },
  { id: "dpd", name: "DPD" },
  { id: "hermes", name: "Hermes (Evri)" },
  { id: "gls", name: "GLS" },
  { id: "tnt", name: "TNT" },
  { id: "chronopost", name: "Chronopost" },
  { id: "laposte-fr", name: "La Poste (France)" },
  { id: "deutsche-post", name: "Deutsche Post" },
  { id: "postnl", name: "PostNL" },
  { id: "bpost", name: "Bpost (Belgium)" },
  { id: "correos-es", name: "Correos (Spain)" },
  { id: "poste-it", name: "Poste Italiane" },
  { id: "postnord", name: "PostNord" },
  { id: "swiss-post", name: "Swiss Post" },
  { id: "austrian-post", name: "Austrian Post" },
  { id: "poczta-polska", name: "Poczta Polska" },
  { id: "japan-post", name: "Japan Post" },
  { id: "australia-post", name: "Australia Post" },
  { id: "china-post", name: "China Post" },
  { id: "ems", name: "EMS" },
  { id: "korea-post", name: "Korea Post" },
  { id: "singapore-post", name: "Singapore Post" },
  { id: "thailand-post", name: "Thailand Post" },
  { id: "india-post", name: "India Post" },
  { id: "aramex", name: "Aramex" },
  { id: "sf-express", name: "SF Express" },
  { id: "yanwen", name: "Yanwen" },
  { id: "cainiao", name: "Cainiao" },
  { id: "yunexpress", name: "YunExpress" },
  { id: "jtexpress", name: "J&T Express" },
  { id: "ninjavan", name: "Ninja Van" },
  { id: "fastway-au", name: "Fastway (Aramex AU)" },
  { id: "toll", name: "Toll Group" },
  { id: "correios-br", name: "Correios (Brazil)" },
  { id: "oca-ar", name: "OCA (Argentina)" },
  { id: "correo-ar", name: "Correo Argentino" },
  { id: "estafeta-mx", name: "Estafeta (Mexico)" },
  { id: "redpack-mx", name: "Redpack (Mexico)" },
  { id: "chilexpress", name: "Chilexpress" },
  { id: "servientrega-co", name: "Servientrega (Colombia)" },
  { id: "other", name: "Other (Specify)" },
]

function addBusinessDays(startDateString: string, days: number): string {
  const currentDate = new Date(startDateString + "T00:00:00Z")
  let businessDaysAdded = 0
  while (businessDaysAdded < days) {
    currentDate.setUTCDate(currentDate.getUTCDate() + 1)
    const dayOfWeek = currentDate.getUTCDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDaysAdded++
    }
  }
  return currentDate.toISOString().split("T")[0]
}

function determineSlaStatus(orderDateStr: string, slaDateStr: string): "on-time" | "delayed" | "at-risk" {
  const orderDate = new Date(orderDateStr + "T00:00:00Z")
  const slaDate = new Date(slaDateStr + "T00:00:00Z")
  const diffTime = slaDate.getTime() - orderDate.getTime()
  const orderIdNum = Number.parseInt(orderDateStr.slice(-2), 10)

  if (orderIdNum % 7 === 0) return "delayed"
  if (orderIdNum % 4 === 0) return "at-risk"
  return "on-time"
}

const mockOrdersData: Omit<Order, "slaDate" | "slaStatus">[] = [
  {
    id: "1",
    orderId: generateRandomOrderId(),
    date: "2023-11-01",
    products: [
      {
        name: "Mobile phone case with extended warranty and premium screen protector",
        price: 101.76,
        quantity: 1,
        sku: "MPC-EW-PSP-001",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Luciana Cohen",
      deliveryAddress: "Rua Augusta, 123, Consolação, São Paulo, SP, 01305-000",
      country: "Brazil",
      countryCode: "BR",
    },
    marketplace: marketplaces.find((m) => m.name === "Mercado Livre" && m.countryCode === "BR")!,
    status: "In process",
    trackingCode: "LP123456789BR",
    carrier: carrierOptions.find((c) => c.id === "dhl"),
    locationName: usWarehouseLocations[0],
    labelUrl: "#",
    totalAmount: 101.76,
  },
  {
    id: "2",
    orderId: generateRandomOrderId(),
    date: "2023-11-01",
    products: [
      {
        name: "Silk Shampoo Rich Moisturizing Cleanser - 500ml",
        price: 10.97,
        quantity: 1,
        sku: "SILK-SHMP-500ML",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Martina Ortiz",
      deliveryAddress: "Av. Callao, 456, Recoleta, Buenos Aires, C1022AAE",
      country: "Argentina",
      countryCode: "AR",
    },
    marketplace: marketplaces.find((m) => m.name === "Mercado Livre" && m.countryCode === "AR")!,
    status: "In process",
    locationName: usWarehouseLocations[1],
    labelUrl: "#",
    totalAmount: 10.97,
  },
  {
    id: "3",
    orderId: generateRandomOrderId(),
    date: "2023-10-28",
    products: [
      {
        name: "Wireless Gaming Mouse RGB",
        price: 49.99,
        quantity: 2,
        sku: "GM-RGB-007",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Carlos Silva",
      deliveryAddress: "Calle Madero, 789, Centro Histórico, Ciudad de México, CDMX, 06000",
      country: "Mexico",
      countryCode: "MX",
    },
    marketplace: marketplaces.find((m) => m.name === "Amazon" && m.countryCode === "MX")!,
    status: "Dispatch pending",
    locationName: usWarehouseLocations[2],
    labelUrl: "#",
    totalAmount: 99.98,
  },
  // ... (rest of mockOrdersData remains the same for brevity)
  {
    id: "4",
    orderId: generateRandomOrderId(),
    date: "2023-10-25",
    products: [
      {
        name: "Yoga Mat Premium Eco-Friendly",
        price: 25.0,
        quantity: 1,
        sku: "YOGA-ECO-PREM",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
      {
        name: "Water Bottle Stainless Steel Insulated 1L",
        price: 15.5,
        quantity: 1,
        sku: "WB-SS-INS-1L",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Ana Pereira",
      deliveryAddress: "Avenida Providencia 1010, Providencia, Santiago, RM",
      country: "Chile",
      countryCode: "CL",
    },
    marketplace: marketplaces.find((m) => m.name === "Coppel" && m.countryCode === "MX")!,
    status: "Shipped",
    trackingCode: "TRK987654321CL",
    carrier: carrierOptions.find((c) => c.id === "chilexpress"),
    locationName: usWarehouseLocations[3],
    labelUrl: "#",
    totalAmount: 40.5,
  },
  {
    id: "5",
    orderId: generateRandomOrderId(),
    date: "2023-11-02",
    products: [
      {
        name: "Smart LED TV 55 inch 4K UHD",
        price: 450.0,
        quantity: 1,
        sku: "TV-LED-55-4K",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Jorge Valdivia",
      deliveryAddress: "Av. Providencia, 1234, Providencia, Santiago, Región Metropolitana, 7500000",
      country: "Chile",
      countryCode: "CL",
    },
    marketplace: marketplaces.find((m) => m.name === "Mercado Livre" && m.countryCode === "CL")!,
    status: "Dispatch pending",
    locationName: usWarehouseLocations[4],
    labelUrl: "#",
    totalAmount: 450.0,
  },
  {
    id: "6",
    orderId: generateRandomOrderId(),
    date: "2023-11-03",
    products: [
      {
        name: "Men's Running Shoes - Size 10",
        price: 75.99,
        quantity: 1,
        sku: "SHOE-RUN-M-10",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Sofia Rodriguez",
      deliveryAddress: "Av. Insurgentes Sur 1000, Del Valle, Benito Juárez, Ciudad de México, CDMX, 03100",
      country: "Mexico",
      countryCode: "MX",
    },
    marketplace: marketplaces.find((m) => m.name === "Walmart" && m.countryCode === "MX")!,
    status: "In process",
    trackingCode: "WMX12345TRACK",
    carrier: carrierOptions.find((c) => c.id === "estafeta-mx"),
    locationName: usWarehouseLocations[0],
    labelUrl: "#",
    totalAmount: 75.99,
  },
  {
    id: "7",
    orderId: generateRandomOrderId(),
    date: "2023-11-04",
    products: [
      {
        name: "Bluetooth Headphones",
        price: 59.99,
        quantity: 1,
        sku: "BTHP-001",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "João Silva",
      deliveryAddress: "Avenida Rio Branco 123, Centro, Rio de Janeiro, RJ",
      country: "Brazil",
      countryCode: "BR",
    },
    marketplace: marketplaces.find((m) => m.name === "Amazon" && m.countryCode === "US")!,
    status: "Shipped",
    trackingCode: "1Z999AA10123456784",
    carrier: carrierOptions.find((c) => c.id === "ups"),
    locationName: usWarehouseLocations[1],
    totalAmount: 59.99,
  },
  {
    id: "8",
    orderId: generateRandomOrderId(),
    date: "2023-11-05",
    products: [
      {
        name: "Laptop Sleeve 13-inch",
        price: 19.99,
        quantity: 1,
        sku: "LSLV-13",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Jane Smith",
      deliveryAddress: "Calle Roble 456, Colonia Centro, Ciudad de México, CDMX",
      country: "Mexico",
      countryCode: "MX",
    },
    marketplace: marketplaces.find((m) => m.name === "Walmart" && m.countryCode === "MX")!,
    status: "In process",
    locationName: usWarehouseLocations[2],
    totalAmount: 19.99,
  },
  {
    id: "9",
    orderId: generateRandomOrderId(),
    date: "2023-11-06",
    products: [
      {
        name: "Coffee Maker Deluxe",
        price: 89.5,
        quantity: 1,
        sku: "CMDLX-01",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Roberto Carlos",
      deliveryAddress: "Av. Paulista, 1500, São Paulo, SP",
      country: "Brazil",
      countryCode: "BR",
    },
    marketplace: marketplaces.find((m) => m.name === "Coppel" && m.countryCode === "MX")!,
    status: "Dispatch pending",
    locationName: usWarehouseLocations[3],
    totalAmount: 89.5,
  },
  {
    id: "10",
    orderId: generateRandomOrderId(),
    date: "2023-11-07",
    products: [
      {
        name: "Smartphone Stand",
        price: 12.0,
        quantity: 2,
        sku: "SPSTND-02",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Maria Garcia",
      deliveryAddress: "Avenida Corrientes 280, San Nicolas, Buenos Aires, CABA",
      country: "Argentina",
      countryCode: "AR",
    },
    marketplace: marketplaces.find((m) => m.name === "Amazon" && m.countryCode === "US")!,
    status: "Shipped",
    trackingCode: "DHL987654321",
    carrier: carrierOptions.find((c) => c.id === "dhl"),
    locationName: usWarehouseLocations[4],
    totalAmount: 24.0,
  },
  {
    id: "11",
    orderId: generateRandomOrderId(),
    date: "2023-11-08",
    products: [
      {
        name: "Wireless Keyboard",
        price: 45.0,
        quantity: 1,
        sku: "WKBD-003",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "David Miller",
      deliveryAddress: "Paseo de la Reforma 789, Cuauhtémoc, Ciudad de México, CDMX",
      country: "Mexico",
      countryCode: "MX",
    },
    marketplace: marketplaces.find((m) => m.name === "Walmart" && m.countryCode === "US")!,
    status: "Delivered",
    trackingCode: "USPS123123123",
    carrier: carrierOptions.find((c) => c.id === "estafeta-mx"),
    locationName: usWarehouseLocations[0],
    totalAmount: 45.0,
  },
  {
    id: "12",
    orderId: generateRandomOrderId(),
    date: "2023-11-09",
    products: [
      {
        name: "Portable Charger 10000mAh",
        price: 29.99,
        quantity: 1,
        sku: "PCHG-10K",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Isabella Rossi",
      deliveryAddress: "Calle Moneda 10, Santiago Centro, Santiago, RM",
      country: "Chile",
      countryCode: "CL",
    },
    marketplace: marketplaces.find((m) => m.name === "Amazon" && m.countryCode === "US")!,
    status: "In process",
    locationName: usWarehouseLocations[1],
    totalAmount: 29.99,
  },
  {
    id: "13",
    orderId: generateRandomOrderId(),
    date: "2023-11-10",
    products: [
      {
        name: "Fitness Tracker Watch",
        price: 79.0,
        quantity: 1,
        sku: "FTW-005",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Ken Tanaka",
      deliveryAddress: "Rua Oscar Freire 111, Jardins, São Paulo, SP",
      country: "Brazil",
      countryCode: "BR",
    },
    marketplace: marketplaces.find((m) => m.name === "Amazon" && m.countryCode === "US")!,
    status: "Dispatch pending",
    locationName: usWarehouseLocations[2],
    totalAmount: 79.0,
  },
  {
    id: "14",
    orderId: generateRandomOrderId(),
    date: "2023-11-11",
    products: [
      {
        name: "Desk Lamp LED",
        price: 33.5,
        quantity: 1,
        sku: "DLAMP-LED",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Olivia Tremblay",
      deliveryAddress: "Avenida Santa Fe 123, Palermo, Buenos Aires, CABA",
      country: "Argentina",
      countryCode: "AR",
    },
    marketplace: marketplaces.find((m) => m.name === "Amazon" && m.countryCode === "CA")!,
    status: "Shipped",
    trackingCode: "CANPOST001",
    carrier: carrierOptions.find((c) => c.id === "correo-ar"),
    locationName: usWarehouseLocations[3],
    totalAmount: 33.5,
  },
  {
    id: "15",
    orderId: generateRandomOrderId(),
    date: "2023-11-12",
    products: [
      {
        name: "Travel Backpack 40L",
        price: 65.0,
        quantity: 1,
        sku: "TRBP-40L",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Lucas Müller",
      deliveryAddress: "Rua Augusta 200, Consolação, São Paulo, SP",
      country: "Brazil",
      countryCode: "BR",
    },
    marketplace: marketplaces.find((m) => m.name === "Walmart" && m.countryCode === "MX")!,
    status: "In process",
    locationName: usWarehouseLocations[4],
    totalAmount: 65.0,
  },
  {
    id: "16",
    orderId: generateRandomOrderId(),
    date: "2023-11-13",
    products: [
      {
        name: "Electric Toothbrush",
        price: 49.95,
        quantity: 1,
        sku: "ETBRUSH-01",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Chloe Dubois",
      deliveryAddress: "Avenida Presidente Masaryk 20, Polanco, Ciudad de México, CDMX",
      country: "Mexico",
      countryCode: "MX",
    },
    marketplace: marketplaces.find((m) => m.name === "Amazon" && m.countryCode === "US")!,
    status: "Dispatch pending",
    locationName: usWarehouseLocations[0],
    totalAmount: 49.95,
  },
  {
    id: "17",
    orderId: generateRandomOrderId(),
    date: "2023-11-14",
    products: [
      {
        name: "Yoga Block Set (2pcs)",
        price: 15.75,
        quantity: 1,
        sku: "YBLK-SET2",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Santiago Perez",
      deliveryAddress: "Paseo de la Reforma 222, CDMX, Mexico",
      country: "Mexico",
      countryCode: "MX",
    },
    marketplace: marketplaces.find((m) => m.name === "Mercado Livre" && m.countryCode === "MX")!,
    status: "Shipped",
    trackingCode: "ESTAFETA002",
    carrier: carrierOptions.find((c) => c.id === "estafeta-mx"),
    locationName: usWarehouseLocations[1],
    totalAmount: 15.75,
  },
  {
    id: "18",
    orderId: generateRandomOrderId(),
    date: "2023-11-15",
    products: [
      {
        name: "Insulated Tumbler 20oz",
        price: 22.0,
        quantity: 1,
        sku: "TUMBLR-20OZ",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Aisha Khan",
      deliveryAddress: "Apoquindo 10, Las Condes, Santiago, RM",
      country: "Chile",
      countryCode: "CL",
    },
    marketplace: marketplaces.find((m) => m.name === "Amazon" && m.countryCode === "US")!,
    status: "Delivered",
    trackingCode: "ROYALMAIL003",
    carrier: carrierOptions.find((c) => c.id === "chilexpress"),
    locationName: usWarehouseLocations[2],
    totalAmount: 22.0,
  },
  {
    id: "19",
    orderId: generateRandomOrderId(),
    date: "2023-11-16",
    products: [
      {
        name: "Gaming Headset Pro",
        price: 99.99,
        quantity: 1,
        sku: "GHPRO-X1",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Fatima Al Fassi",
      deliveryAddress: "Avenida Atlântica S/N, Copacabana, Rio de Janeiro, RJ",
      country: "Brazil",
      countryCode: "BR",
    },
    marketplace: marketplaces.find((m) => m.name === "Amazon" && m.countryCode === "US")!,
    status: "In process",
    locationName: usWarehouseLocations[3],
    totalAmount: 99.99,
  },
  {
    id: "20",
    orderId: generateRandomOrderId(),
    date: "2023-11-17",
    products: [
      {
        name: "Resistance Bands Set",
        price: 18.5,
        quantity: 1,
        sku: "RBANDS-SET",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Liam O'Connell",
      deliveryAddress: "Calle Florida 1, Microcentro, Buenos Aires, CABA",
      country: "Argentina",
      countryCode: "AR",
    },
    marketplace: marketplaces.find((m) => m.name === "Walmart" && m.countryCode === "MX")!,
    status: "Dispatch pending",
    locationName: usWarehouseLocations[4],
    totalAmount: 18.5,
  },
  {
    id: "21",
    orderId: generateRandomOrderId(),
    date: "2023-11-18",
    products: [
      {
        name: "Smart Plug Wi-Fi (2-pack)",
        price: 25.99,
        quantity: 1,
        sku: "SPLUG-WIFI2",
        imageUrl: "/placeholder.svg?height=40&width=40",
      },
    ],
    customer: {
      name: "Chen Wei",
      deliveryAddress: "Avenida de los Insurgentes Sur 100, Roma Norte, Ciudad de México, CDMX",
      country: "Mexico",
      countryCode: "MX",
    },
    marketplace: marketplaces.find((m) => m.name === "Shopee" && m.countryCode === "BR")!,
    status: "Shipped",
    trackingCode: "CHINAPOST004",
    carrier: carrierOptions.find((c) => c.id === "estafeta-mx"),
    locationName: usWarehouseLocations[0],
    totalAmount: 25.99,
  },
]

const mockOrders: Order[] = mockOrdersData.map((orderData) => {
  const slaDate = addBusinessDays(orderData.date, 3)
  const slaStatus = determineSlaStatus(orderData.date, slaDate)
  return {
    ...orderData,
    slaDate,
    slaStatus,
  }
})

export default function OrdersPageModern() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const [searchBy, setSearchBy] = useState("order_id")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>(["Dispatch pending"])
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const [editingOrderForTracking, setEditingOrderForTracking] = useState<Order | null>(null)
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null)

  const openCancelOrderModal = (order: Order) => {
    setOrderToCancel(order)
    setIsCancelModalOpen(true)
  }

  const handleConfirmCancellation = (orderId: string, reason: string, customReason?: string) => {
    setOrders((prevOrders) => prevOrders.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" } : o)))
    const cancelledOrder = orders.find((o) => o.id === orderId)
    toast({
      title: "Order Cancelled",
      description: `Order ${cancelledOrder?.orderId} has been cancelled. Reason: ${reason}${customReason ? " - " + customReason : ""}.`,
      variant: "destructive",
    })
    setSelectedOrders((prev) => {
      const newSelected = new Set(prev)
      newSelected.delete(orderId)
      return newSelected
    })
  }

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedOrders(new Set(filteredOrders.map((o) => o.id)))
    } else {
      setSelectedOrders(new Set())
    }
  }

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    const newSelected = new Set(selectedOrders)
    if (checked) newSelected.add(orderId)
    else newSelected.delete(orderId)
    setSelectedOrders(newSelected)
  }

  const openEditTrackingModal = (order: Order) => {
    setEditingOrderForTracking(order)
    setIsTrackingModalOpen(true)
  }

  const handleSaveTrackingNumber = (
    orderId: string,
    trackingCode: string,
    carrierId: string,
    customCarrierName?: string,
  ) => {
    let carrierInfo: CarrierInfo | undefined
    if (carrierId === "other" && customCarrierName) {
      carrierInfo = { id: "other", name: customCarrierName }
    } else {
      carrierInfo = carrierOptions.find((c) => c.id === carrierId)
    }

    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === orderId
          ? { ...o, trackingCode: trackingCode, carrier: carrierInfo, status: "Validating Tracking" }
          : o,
      ),
    )
    toast({
      title: "Tracking Info Saved",
      description: `Order ${
        orders.find((o) => o.id === orderId)?.orderId
      } tracking updated. Status: Validating Tracking.`,
    })
  }

  const handleConfirmShipment = (orderId: string) => {
    const orderToUpdate = orders.find((o) => o.id === orderId)
    if (!orderToUpdate) return

    if (!orderToUpdate.trackingCode || !orderToUpdate.carrier) {
      toast({
        title: "Missing Information",
        description: "Please add tracking code and select carrier before confirming shipment.",
        variant: "destructive",
      })
      return
    }

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "Shipped",
            }
          : order,
      ),
    )

    toast({
      title: "Shipment Confirmed",
      description: `Order ${orderToUpdate.orderId} has been marked as shipped.`,
    })
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      let matchesSearch = true
      if (searchQuery.trim()) {
        const lowerQuery = searchQuery.toLowerCase()
        if (searchBy === "order_id") matchesSearch = order.orderId.toLowerCase().includes(lowerQuery)
        else if (searchBy === "product_id")
          matchesSearch = order.products.some((p) => p.name.toLowerCase().includes(lowerQuery))
        else if (searchBy === "customer_id")
          matchesSearch =
            order.customer.name.toLowerCase().includes(lowerQuery) ||
            order.customer.deliveryAddress.toLowerCase().includes(lowerQuery)
        else if (searchBy === "sku")
          matchesSearch = order.products.some((p) => p.sku.toLowerCase().includes(lowerQuery))
      }
      let matchesStatus = true
      if (statusFilter.length > 0 && !statusFilter.includes("all")) {
        matchesStatus = statusFilter.includes(order.status)
      }

      let matchesDate = true
      if (dateRange?.from) {
        const orderDate = new Date(order.date + "T00:00:00Z")
        if (orderDate < dateRange.from) matchesDate = false
        if (dateRange.to) {
          // Adjust 'to' date to be inclusive by setting time to end of day or comparing with start of next day
          const toDateEndOfDay = new Date(dateRange.to)
          toDateEndOfDay.setHours(23, 59, 59, 999) // Consider the whole 'to' day
          if (orderDate > toDateEndOfDay) matchesDate = false
        } else {
          // If only 'from' is selected, filter for dates on or after 'from'
          // This part is fine, but if 'to' is also part of the range, the above 'to' condition handles it.
        }
      }

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [orders, searchBy, searchQuery, statusFilter, dateRange])

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter((prev) => {
      if (status === "all") return prev.includes("all") ? [] : ["all"]
      const newFilter = prev.filter((s) => s !== "all")
      if (newFilter.includes(status)) return newFilter.filter((s) => s !== status)
      return [...newFilter, status]
    })
  }

  const renderProductInfo = (order: Order) => {
    const firstProduct = order.products[0]
    if (!firstProduct) return <span className="text-xs text-muted-foreground">No product data</span>

    return (
      <div className="flex items-center gap-3">
        <img
          src={firstProduct.imageUrl || "/placeholder.svg?height=36&width=36&query=Product"}
          alt={firstProduct.name}
          className="h-9 w-9 rounded object-cover border bg-slate-50"
        />
        <div className="min-w-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors">
                <Link href={`/orders/${order.id}`}>{firstProduct.name}</Link>
              </p>
            </TooltipTrigger>
            <TooltipContent side="top" align="start" className="max-w-xs break-words">
              <p>{firstProduct.name}</p>
            </TooltipContent>
          </Tooltip>
          <div className="text-xs text-muted-foreground">
            <span>SKU: {firstProduct.sku}</span>
            {order.products.length > 1 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 font-medium text-primary cursor-pointer">
                    +{order.products.length - 1} more
                  </span>
                </TooltipTrigger>
                <TooltipContent className="text-xs p-2 max-w-xs">
                  <p className="font-semibold mb-1">Additional Products:</p>
                  <ul className="list-disc pl-4">
                    {order.products.slice(1).map((p, i) => (
                      <li key={i} className="truncate">
                        {p.name} (SKU: {p.sku})
                      </li>
                    ))}
                  </ul>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    )
  }

  function formatDate(dateString: string, format: "full" | "short" = "full"): string {
    const date = new Date(dateString + "T00:00:00Z")
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: format === "full" ? "long" : "short",
      day: "numeric",
      timeZone: "UTC",
    }
    return date.toLocaleDateString(undefined, options)
  }

  function getCityFromAddress(address: string): string {
    const parts = address.split(",")
    if (parts.length >= 2) {
      return parts[parts.length - 2].trim()
    }
    return address
  }

  const StatusBadge = ({ status }: { status: Order["status"] }) => {
    let badgeColor = "bg-gray-100 text-gray-700"
    if (status === "Dispatch pending") badgeColor = "bg-blue-100 text-blue-700"
    if (status === "In process") badgeColor = "bg-yellow-100 text-yellow-700"
    if (status === "Validating Tracking") badgeColor = "bg-purple-100 text-purple-700"
    if (status === "Shipped") badgeColor = "bg-green-100 text-green-700"
    if (status === "Delivered") badgeColor = "bg-green-500 text-white"
    if (status === "Cancelled") badgeColor = "bg-red-100 text-red-700"

    return (
      <div
        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-600/20 ${badgeColor}`}
      >
        {status}
      </div>
    )
  }

  const SLADisplay = ({ slaStatus, slaDate }: { slaStatus: "on-time" | "delayed" | "at-risk"; slaDate: string }) => {
    const slaDateFormatted = formatDate(slaDate, "short")
    let icon = null
    let textColor = "text-muted-foreground"
    let statusText = ""

    if (slaStatus === "on-time") {
      icon = <CheckCircle2 className="h-4 w-4 text-green-500" />
      textColor = "text-green-600"
      statusText = "On Time:"
    } else if (slaStatus === "at-risk") {
      icon = <AlertTriangle className="h-4 w-4 text-orange-500" />
      textColor = "text-orange-600"
      statusText = "At Risk:"
    } else if (slaStatus === "delayed") {
      icon = <AlertTriangle className="h-4 w-4 text-red-500" />
      textColor = "text-red-600"
      statusText = "Delayed:"
    }

    return (
      <div className="flex items-center gap-1.5">
        {icon}
        <span className={`text-xs font-medium ${textColor}`}>
          {statusText} {slaDateFormatted}
        </span>
      </div>
    )
  }

  const copyToClipboard = (text: string, toastFn: typeof toast) => {
    navigator.clipboard.writeText(text)
    toastFn({
      title: "Copied to clipboard",
      description: "Tracking code copied to clipboard.",
    })
  }

  const EditTrackingModal = ({
    isOpen,
    onOpenChange,
    order,
    onSave,
  }: {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    order: Order | null
    onSave: (orderId: string, trackingCode: string, carrierId: string, customCarrierName?: string) => void
  }) => {
    const [trackingCode, setTrackingCode] = useState("")
    const [carrierId, setCarrierId] = useState("")
    const [customCarrierName, setCustomCarrierName] = useState("")

    useEffect(() => {
      if (order) {
        setTrackingCode(order.trackingCode || "")
        const currentCarrierId = order.carrier?.id || ""
        setCarrierId(currentCarrierId)
        if (currentCarrierId === "other" && order.carrier?.name && order.carrier.name !== "Other (Specify)") {
          setCustomCarrierName(order.carrier.name)
        } else {
          setCustomCarrierName("")
        }
      } else {
        setTrackingCode("")
        setCarrierId("")
        setCustomCarrierName("")
      }
    }, [order])

    const handleSave = () => {
      if (order) {
        if (!trackingCode.trim()) {
          alert("Tracking code cannot be empty.")
          return
        }
        if (!carrierId) {
          alert("Please select a carrier.")
          return
        }
        if (carrierId === "other" && !customCarrierName.trim()) {
          alert("Please specify carrier name for 'Other'.")
          return
        }
        onSave(order.id, trackingCode, carrierId, customCarrierName)
        onOpenChange(false)
      }
    }

    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Tracking Information</DialogTitle>
            <DialogDescription>Update the tracking information for order {order?.orderId}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="trackingCodeModal" className="text-right">
                Tracking Code
              </Label>
              <Input
                id="trackingCodeModal"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carrierModal" className="text-right">
                Carrier
              </Label>
              <Select value={carrierId} onValueChange={setCarrierId}>
                <SelectTrigger id="carrierModal" className="col-span-3">
                  <SelectValue placeholder="Select a carrier" />
                </SelectTrigger>
                <SelectContent>
                  {carrierOptions.map((carrier) => (
                    <SelectItem key={carrier.id} value={carrier.id}>
                      {carrier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {carrierId === "other" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customCarrierNameModal" className="text-right">
                  Carrier Name
                </Label>
                <Input
                  id="customCarrierNameModal"
                  value={customCarrierName}
                  onChange={(e) => setCustomCarrierName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const SearchByIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "order_id":
        return <Tag className="h-3.5 w-3.5" />
      case "customer_id":
        return <User className="h-3.5 w-3.5" />
      default:
        return <Tag className="h-3.5 w-3.5" />
    }
  }

  const orderStatusOptions = [
    "Dispatch pending",
    "In process",
    "Validating Tracking",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]

  return (
    <TooltipProvider>
      <main className="flex-1 flex flex-col p-6 md:p-8 gap-6 bg-gray-50/50 overflow-y-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">Manage and track your customer orders</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-5 group-hover:opacity-10 transition-opacity" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg">
                <Package className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="relative pb-4 px-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{orders.length}</div>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <div className="flex items-center text-sm font-medium text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  12%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-amber-500 opacity-5 group-hover:opacity-10 transition-opacity" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
              <div className="p-2.5 bg-gradient-to-br from-yellow-500 to-amber-500 text-white rounded-xl shadow-lg">
                <Clock className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="relative pb-4 px-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {orders.filter(o => o.status === "Dispatch pending").length}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Awaiting dispatch</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-5 group-hover:opacity-10 transition-opacity" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium text-gray-600">Shipped</CardTitle>
              <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl shadow-lg">
                <Truck className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="relative pb-4 px-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {orders.filter(o => o.status === "Shipped").length}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">In transit</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-5 group-hover:opacity-10 transition-opacity" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
              <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg">
                <DollarSign className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="relative pb-4 px-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    ${orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Total value</p>
                </div>
                <div className="flex items-center text-sm font-medium text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  8%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 p-5 bg-white border-0 rounded-xl shadow-lg">
          <div className="relative flex-grow w-full md:max-w-md group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
            <Input
              type="search"
              placeholder={`Search by ${searchBy === 'order_id' ? 'Order ID' : searchBy === 'product_id' ? 'Product' : searchBy === 'customer_id' ? 'Customer' : 'SKU'}...`}
              className="w-full pl-10 pr-3 py-2 h-10 bg-gray-50 border-gray-200 rounded-xl hover:bg-white hover:border-green-300 focus:bg-white focus:border-green-400 transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Select value={searchBy} onValueChange={setSearchBy}>
              <SelectTrigger className="w-32 h-10 bg-white border-gray-200 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="order_id">Order ID</SelectItem>
                <SelectItem value="product_id">Product</SelectItem>
                <SelectItem value="customer_id">Customer</SelectItem>
                <SelectItem value="sku">SKU</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 gap-2 bg-white hover:bg-gray-50 border-gray-200 rounded-xl shadow-sm">
                  <PackageIcon className="h-4 w-4" />
                  <span>Status: {statusFilter.length === 0 || statusFilter.includes("all") ? "All" : statusFilter.join(", ")}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-0 p-2">
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes("all") || statusFilter.length === 0}
                  onCheckedChange={() => handleStatusFilterChange("all")}
                  className="rounded-lg hover:bg-green-50 cursor-pointer"
                >
                  All Statuses
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator className="mx-2" />
                {orderStatusOptions.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={() => handleStatusFilterChange(status)}
                    onSelect={(e) => e.preventDefault()}
                    className="rounded-lg hover:bg-green-50 cursor-pointer"
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DateRangePicker
              date={dateRange}
              setDate={setDateRange}
              placeholder="Select date range"
              buttonClassName="h-10"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" className="h-10 bg-white hover:bg-gray-50 border-gray-200 rounded-xl shadow-sm">
              <FileText className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="h-10 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg shadow-lg shadow-green-500/25">
              <Ship className="h-4 w-4 mr-2" />
              Bulk Ship
            </Button>
          </div>
        </div>

        <Card className="shadow-lg bg-white border-0 rounded-xl overflow-hidden flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-50 hover:to-gray-100 border-b border-gray-200">
                  <TableHead className="w-[50px] px-4 py-4">
                    <Checkbox
                      checked={
                        selectedOrders.size === filteredOrders.length && filteredOrders.length > 0
                          ? true
                          : selectedOrders.size > 0
                            ? "indeterminate"
                            : false
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all rows"
                      className="border-gray-300"
                    />
                  </TableHead>
                  <TableHead className="px-4 py-4 text-sm font-semibold text-gray-700">Order Info</TableHead>
                  <TableHead className="px-4 py-4 text-sm font-semibold text-gray-700">Products</TableHead>
                  <TableHead className="px-4 py-4 text-sm font-semibold text-gray-700">Customer</TableHead>
                  <TableHead className="px-4 py-4 text-sm font-semibold text-gray-700">Total</TableHead>
                  <TableHead className="px-4 py-4 text-sm font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="px-4 py-4 text-sm font-semibold text-gray-700">SLA</TableHead>
                  <TableHead className="px-4 py-4 text-sm font-semibold text-gray-700">Tracking</TableHead>
                  <TableHead className="px-4 py-4 text-sm font-semibold text-gray-700">Deliver to</TableHead>
                  <TableHead className="w-[100px] px-4 py-4 text-sm font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      data-state={selectedOrders.has(order.id) ? "selected" : ""}
                      className={cn(
                        "border-b border-gray-100 transition-all duration-200",
                        selectedOrders.has(order.id) 
                          ? "bg-green-50" 
                          : "hover:bg-gray-50"
                      )}
                    >
                      <TableCell className="px-4 py-3">
                        <Checkbox
                          checked={selectedOrders.has(order.id)}
                          onCheckedChange={(checked) => handleSelectOrder(order.id, !!checked)}
                          aria-label={`Select order ${order.orderId}`}
                          className="border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">{order.orderId}</p>
                          <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
                          <div className="flex items-center gap-2">
                            {order.marketplace.logoUrl && (
                              <img
                                src={order.marketplace.logoUrl}
                                alt={order.marketplace.name}
                                className="h-4 w-auto"
                              />
                            )}
                            <span className="text-xs text-gray-500">{order.marketplace.name}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">{renderProductInfo(order)}</TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                          <p className="text-xs text-gray-500">
                            {getCityFromAddress(order.customer.deliveryAddress)}, {order.customer.countryCode}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <SLADisplay slaStatus={order.slaStatus} slaDate={order.slaDate} />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {order.trackingCode ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-700" onClick={() => copyToClipboard(order.trackingCode!, toast)}>
                                {order.trackingCode}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-blue-50 rounded-lg"
                                onClick={() => openEditTrackingModal(order)}
                                disabled={order.status === "Delivered" || order.status === "Cancelled"}
                              >
                                <Edit2 className="h-3 w-3 text-blue-600" />
                              </Button>
                            </div>
                            {order.carrier && (
                              <p className="text-xs text-gray-500">via {order.carrier.name}</p>
                            )}
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditTrackingModal(order)}
                            disabled={order.status === "Delivered" || order.status === "Cancelled"}
                            className="h-8 text-xs bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 rounded-lg"
                          >
                            <PlusCircle className="h-3 w-3 mr-1" />
                            Add Tracking
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{order.locationName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 rounded-lg">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-0 p-2">
                            <DropdownMenuItem className="rounded-lg hover:bg-blue-50 cursor-pointer">
                              <FileText className="mr-2 h-4 w-4 text-blue-500" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                if (order.labelUrl) {
                                  window.open(order.labelUrl, "_blank")
                                }
                              }}
                              disabled={!order.labelUrl}
                              className="rounded-lg hover:bg-green-50 cursor-pointer"
                            >
                              <Printer className="mr-2 h-4 w-4 text-green-500" />
                              Print Label
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="mx-2" />
                            {order.status === "Validating Tracking" && (
                              <DropdownMenuItem
                                onClick={() => handleConfirmShipment(order.id)}
                                className="rounded-lg hover:bg-green-50 cursor-pointer"
                              >
                                <Ship className="mr-2 h-4 w-4 text-green-500" />
                                Confirm Shipment
                              </DropdownMenuItem>
                            )}
                            {order.status !== "Cancelled" && order.status !== "Delivered" && order.status !== "Shipped" && (
                              <DropdownMenuItem
                                onClick={() => openCancelOrderModal(order)}
                                className="rounded-lg hover:bg-red-50 cursor-pointer text-red-600"
                              >
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Cancel Order
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ShoppingCart className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-500">No orders found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>

      <EditTrackingModal
        isOpen={isTrackingModalOpen}
        onOpenChange={setIsTrackingModalOpen}
        order={editingOrderForTracking}
        onSave={handleSaveTrackingNumber}
      />
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onOpenChange={setIsCancelModalOpen}
        order={orderToCancel}
        onConfirmCancellation={handleConfirmCancellation}
      />
    </TooltipProvider>
  )
}
