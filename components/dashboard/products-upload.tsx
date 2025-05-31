import type React from "react"
import { BarChart3, ClipboardList, CircleDollarSign, PlusCircle } from "lucide-react"
import { Card } from "@/components/ui/card" // Removed CardHeader, CardTitle
import { cn } from "@/lib/utils"
import Link from "next/link"

interface QuickActionButtonProps {
  icon: React.ElementType
  line1: string
  line2: string
  href: string
}

function QuickActionButton({ icon: Icon, line1, line2, href }: QuickActionButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center p-3 rounded-lg bg-white hover:bg-orange-50 border border-orange-100 hover:border-orange-200 transition-all shadow-sm hover:shadow-md",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      )}
    >
      <div className="mr-3 p-2 bg-orange-100 rounded-md">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-orange-700">{line1}</p>
        <p className="text-xs text-slate-500">{line2}</p>
      </div>
    </Link>
  )
}

export function ProductsUpload() {
  // Renaming to reflect the new design and purpose
  const actions = [
    { icon: PlusCircle, line1: "Add", line2: "Products", href: "/products/new" },
    { icon: ClipboardList, line1: "Check", line2: "Orders", href: "/orders" },
    { icon: CircleDollarSign, line1: "View", line2: "Balance", href: "/balance" },
    { icon: BarChart3, line1: "See", line2: "Analytics", href: "/analytics" },
  ]

  return (
    <Card className="bg-card shadow-sm rounded-lg h-full flex flex-col p-3 md:p-4">
      <h2 className="text-xl font-bold text-primary mb-3 md:mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3 md:gap-4 flex-1">
        {actions.map((action) => (
          <QuickActionButton
            key={action.line2}
            icon={action.icon}
            line1={action.line1}
            line2={action.line2}
            href={action.href}
          />
        ))}
      </div>
    </Card>
  )
}
