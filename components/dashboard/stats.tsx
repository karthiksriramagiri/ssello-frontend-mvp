import type React from "react"
import { AlertCircle, Clock, Package, PackageCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: number | string // Allow string for formatted values like "$0"
  icon: React.ReactNode
  variant?: "default" | "warning" | "success"
}

function StatCard({ title, value, icon, variant = "default" }: StatCardProps) {
  const iconColorClass =
    variant === "warning" ? "text-amber-600" : variant === "success" ? "text-green-600" : "text-primary"

  const iconBgClass = variant === "warning" ? "bg-amber-100" : variant === "success" ? "bg-green-100" : "bg-orange-100"

  return (
    <Card className="shadow-sm rounded-lg bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-3">
        <CardTitle className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">{title}</CardTitle>
        <div className={cn("p-1 rounded-md", iconBgClass, iconColorClass)}>{icon}</div>
      </CardHeader>
      <CardContent className="pb-2 pt-0 px-3">
        <div className="text-xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  return (
    <>
      <StatCard title="Pending Orders" value={0} icon={<Clock className="h-3.5 w-3.5" />} />
      <StatCard title="Delayed Orders" value={0} icon={<AlertCircle className="h-3.5 w-3.5" />} variant="warning" />
      <StatCard title="Out of Stock" value={0} icon={<Package className="h-3.5 w-3.5" />} />
      <StatCard title="Total Products" value={2} icon={<PackageCheck className="h-3.5 w-3.5" />} variant="success" />
    </>
  )
}
