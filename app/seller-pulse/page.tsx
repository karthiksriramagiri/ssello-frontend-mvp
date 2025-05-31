"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { SellerPulse } from "@/components/dashboard/seller-pulse"
import { AlertCircle, ArrowRight, Clock, PackageX, ShieldAlert, TrendingUp, Target, Award, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type React from "react"

interface MetricDetail {
  id: string
  title: string
  icon: React.ElementType
  iconColor: string
  gradient: string
  weight: number
  currentRate: number
  currentValue: number
  valueUnit: string
  targetRate: number
  description: string
  learnMoreLink: string
  isLowerBetter: boolean
}

interface SellerPulsePageData {
  overallScore: number
  trend: "improving" | "declining" | "stable"
  metrics: MetricDetail[]
}

const sellerPulsePageData: SellerPulsePageData = {
  overallScore: 78,
  trend: "improving",
  metrics: [
    {
      id: "cancellations",
      title: "Order Cancellations",
      icon: PackageX,
      iconColor: "text-red-500",
      gradient: "from-red-500 to-rose-500",
      weight: 20,
      currentRate: 1.5,
      currentValue: 3,
      valueUnit: "orders",
      targetRate: 2.0,
      description: "Minimizing order cancellations initiated by you is crucial for customer satisfaction and trust.",
      learnMoreLink: "/help/seller-pulse/cancellations",
      isLowerBetter: true,
    },
    {
      id: "delayedDeliveries",
      title: "Delayed Deliveries",
      icon: Clock,
      iconColor: "text-amber-500",
      gradient: "from-yellow-500 to-amber-500",
      weight: 40,
      currentRate: 3.2,
      currentValue: 7,
      valueUnit: "orders",
      targetRate: 5.0,
      description: "Ensuring orders are shipped and delivered within the promised timeframe impacts your score significantly.",
      learnMoreLink: "/help/seller-pulse/delayed-deliveries",
      isLowerBetter: true,
    },
    {
      id: "problematicOrders",
      title: "Problematic Orders",
      icon: ShieldAlert,
      iconColor: "text-purple-500",
      gradient: "from-purple-500 to-pink-500",
      weight: 40,
      currentRate: 0.8,
      currentValue: 2,
      valueUnit: "reports",
      targetRate: 1.0,
      description: "This includes orders with issues like incorrect items, damages, or other customer complaints requiring resolution.",
      learnMoreLink: "/help/seller-pulse/problematic-orders",
      isLowerBetter: true,
    },
  ],
}

function getPerformanceStatus(currentRate: number, targetRate: number, isLowerBetter: boolean) {
  const deviation = isLowerBetter ? currentRate / targetRate : targetRate / currentRate
  if (isLowerBetter) {
    if (currentRate <= targetRate) return { text: "Excellent", color: "text-green-600", badgeGradient: "from-green-100 to-emerald-100 text-green-700 border-green-200" }
    if (currentRate <= targetRate * 1.25) return { text: "Good", color: "text-blue-600", badgeGradient: "from-blue-100 to-indigo-100 text-blue-700 border-blue-200" }
    if (currentRate <= targetRate * 1.5) return { text: "Fair", color: "text-amber-600", badgeGradient: "from-yellow-100 to-amber-100 text-amber-700 border-amber-200" }
    return { text: "Needs Improvement", color: "text-red-600", badgeGradient: "from-red-100 to-rose-100 text-red-700 border-red-200" }
  } else {
    if (currentRate >= targetRate) return { text: "Excellent", color: "text-green-600", badgeGradient: "from-green-100 to-emerald-100 text-green-700 border-green-200" }
    if (currentRate >= targetRate * 0.75) return { text: "Good", color: "text-blue-600", badgeGradient: "from-blue-100 to-indigo-100 text-blue-700 border-blue-200" }
    if (currentRate >= targetRate * 0.5) return { text: "Fair", color: "text-amber-600", badgeGradient: "from-yellow-100 to-amber-100 text-amber-700 border-amber-200" }
    return { text: "Needs Improvement", color: "text-red-600", badgeGradient: "from-red-100 to-rose-100 text-red-700 border-red-200" }
  }
}

export default function SellerPulsePage() {
  const { overallScore, trend, metrics } = sellerPulsePageData

  return (
    <main className="flex-1 flex flex-col p-6 md:p-8 gap-6 bg-gray-50/50 overflow-y-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Pulse</h1>
          <p className="text-gray-600 mt-1">Track your performance metrics and improve your seller rating</p>
        </div>
        <div className="flex items-center gap-4">
          <Card className="relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 opacity-5 group-hover:opacity-10 transition-opacity" />
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-xl shadow-lg">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Overall Score</p>
                  <p className="text-3xl font-bold text-gray-900">{overallScore}%</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {trend === "improving" ? "Improving" : trend === "declining" ? "Declining" : "Stable"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => {
          const status = getPerformanceStatus(metric.currentRate, metric.targetRate, metric.isLowerBetter)
          let progressValue = 0
          if (metric.isLowerBetter) {
            if (metric.currentRate === 0) {
              progressValue = 100
            } else {
              progressValue = Math.max(0, 100 - (metric.currentRate / (metric.targetRate * 1.5)) * 100)
            }
          } else {
            progressValue = Math.min(100, (metric.currentRate / metric.targetRate) * 100)
          }

          return (
            <Card key={metric.id} className="relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity", metric.gradient)} />
              <CardHeader className="relative pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className={cn("p-2.5 bg-gradient-to-br text-white rounded-xl shadow-lg", metric.gradient)}>
                    <metric.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-transparent bg-clip-text">
                    {metric.weight}% Impact
                  </span>
                </div>
                <CardTitle className="text-lg text-gray-900">{metric.title}</CardTitle>
                <div className="flex items-center gap-3 mt-2">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{metric.currentRate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">
                      {metric.currentValue} {metric.valueUnit}
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Target: &lt; {metric.targetRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={progressValue} className="h-2" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-3">
                <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r border", status.badgeGradient)}>
                  {status.text}
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">{metric.description}</p>
                <Button variant="ghost" asChild className="p-0 h-auto text-xs hover:bg-transparent group/btn">
                  <Link href={metric.learnMoreLink} className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                    Learn More 
                    <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-xl text-gray-900">Understanding Your Score</CardTitle>
            </div>
          </CardHeader>
        </div>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            The Seller Pulse is a dynamic score that reflects your recent performance. It is calculated based on the
            weighted average of the metrics listed above over a defined period.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            A higher score generally leads to better visibility, customer trust, and potentially lower fees or access to
            exclusive platform benefits. Consistently meeting or exceeding targets is key to maintaining a strong Seller
            Pulse.
          </p>
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 mt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-gray-700">
                  For detailed calculation methods and specific time windows for each metric, please refer to our{" "}
                  <Link href="/help/seller-pulse-guide" className="text-orange-600 font-medium hover:text-orange-700 underline">
                    Seller Pulse Guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl shadow-lg">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Next Goal</h3>
                <p className="text-sm text-gray-600">Reduce delayed deliveries to under 5%</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Achievement</h3>
                <p className="text-sm text-gray-600">Top 20% seller this month</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Card>
      </div>
    </main>
  )
}
