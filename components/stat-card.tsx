import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: number
  gradient?: string
  description?: string
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  gradient = "from-blue-500 to-indigo-500", 
  description 
}: StatCardProps) {
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
          <div>
            <div className="text-3xl font-bold text-gray-900">{value}</div>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
          {trend !== undefined && (
            <div className={cn("flex items-center text-sm font-medium", trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-500")}>
              {trend > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : trend < 0 ? <ArrowDownRight className="w-4 h-4 mr-1" /> : null}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 