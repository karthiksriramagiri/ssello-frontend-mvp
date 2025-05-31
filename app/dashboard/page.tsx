"use client"

import type React from "react"
import { useState } from "react"
// UI Components (shadcn/ui)
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SellerPulse } from "@/components/dashboard/seller-pulse"
import { Badge } from "@/components/ui/badge"

// Icons (lucide-react)
import {
  Rocket,
  CircleDashed,
  AlertCircleIcon,
  X,
  Clock,
  PackageIcon,
  PackageCheck,
  Calendar,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  PlusCircle,
  BarChart3,
  ClipboardList,
  CircleDollarSign,
  HelpCircle,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react"

// Charting Library
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts"

// Utilities
import { cn } from "@/lib/utils"
import Link from "next/link"

/* ==========================================================================
OnboardingProgress Component
========================================================================== */
function OnboardingProgress() {
  const steps = [
    { title: "Account Created", isCompleted: true },
    { title: "Products Uploaded", isCompleted: true },
    { title: "Link Bank Account", isCompleted: false },
    { title: "Upload Documents", isCompleted: false },
  ]

  const completedSteps = steps.filter((step) => step.isCompleted).length
  const progressValue = (completedSteps / steps.length) * 100
  const allStepsCompleted = completedSteps === steps.length

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 border border-orange-200/50 p-3 shadow-lg backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent animate-shimmer" />
      <div className="relative flex items-center gap-3">
        <div className="relative flex-shrink-0">
          {allStepsCompleted ? (
            <Rocket className="h-5 w-5 text-green-600" />
          ) : (
            <CircleDashed className="h-5 w-5 text-orange-600 animate-pulse" />
          )}
          <div className="absolute -inset-1 bg-orange-500/20 rounded-full blur-md animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-gray-900 truncate">
            {allStepsCompleted ? "Onboarding Complete!" : "Complete Your Onboarding"}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Progress value={progressValue} className="h-2 bg-white/50 flex-1" indicatorClassName="bg-gradient-to-r from-orange-500 to-amber-500" />
            <span className="text-xs font-medium text-gray-600 flex-shrink-0">
              {completedSteps}/{steps.length}
            </span>
          </div>
        </div>
        {!allStepsCompleted && (
          <Button
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-200 text-xs h-7 px-2 flex-shrink-0"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Finish
          </Button>
        )}
      </div>
    </div>
  )
}

/* ==========================================================================
Notification Component
========================================================================== */
interface NotificationProps {
  title: string
  message: string
  isNew?: boolean
}

function Notification({ title, message, isNew = false }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return null
  }

  return (
    <Alert className="relative bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 p-3 rounded-xl shadow-md">
      {isNew && (
        <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 px-1.5 py-0 text-[10px] shadow-lg">
          NEW
        </Badge>
      )}
      <div className="flex items-center">
        <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg text-white mr-2.5 shadow-lg shadow-blue-500/20">
          <AlertCircleIcon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <AlertTitle className="text-sm font-semibold text-gray-900 truncate">{title}</AlertTitle>
          <AlertDescription className="text-xs text-gray-600 truncate">{message}</AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 h-6 w-6 rounded-lg hover:bg-white/60 flex-shrink-0"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Alert>
  )
}

/* ==========================================================================
DashboardStats Component (includes StatCard)
========================================================================== */
interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: number
  variant?: "default" | "warning" | "success" | "info"
}

function StatCard({ title, value, icon, trend, variant = "default" }: StatCardProps) {
  const variants = {
    default: "from-orange-500 to-amber-500",
    warning: "from-red-500 to-rose-500",
    success: "from-green-500 to-emerald-500",
    info: "from-blue-500 to-indigo-500",
  }

  const shadowVariants = {
    default: "shadow-orange-500/20",
    warning: "shadow-red-500/20",
    success: "shadow-green-500/20",
    info: "shadow-blue-500/20",
  }

  return (
    <Card className="relative overflow-hidden bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 group p-3">
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity", variants[variant])} />
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-xl font-bold text-gray-900">{value}</p>
            {trend !== undefined && (
              <span className={cn("flex items-center text-xs font-medium", trend > 0 ? "text-green-600" : "text-red-600")}>
                {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
        <div className={cn("p-2 bg-gradient-to-br text-white rounded-lg shadow-md", variants[variant], shadowVariants[variant])}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

function DashboardStats() {
  return (
    <>
      <StatCard title="Pending Orders" value={0} icon={<Clock className="h-4 w-4" />} trend={0} variant="info" />
      <StatCard
        title="Delayed Orders"
        value={10}
        icon={<AlertCircleIcon className="h-4 w-4" />}
        trend={-15}
        variant="warning"
      />
      <StatCard title="Out of Stock" value={4} icon={<PackageIcon className="h-4 w-4" />} trend={-20} variant="default" />
      <StatCard title="Total Products" value={400} icon={<PackageCheck className="h-4 w-4" />} trend={12} variant="success" />
    </>
  )
}

/* ==========================================================================
BusinessMetrics Component
========================================================================== */
const initialChartData = [
  { date: "Jan", sales: 65, orders: 28, revenue: 12500 },
  { date: "Feb", sales: 59, orders: 48, revenue: 11200 },
  { date: "Mar", sales: 80, orders: 40, revenue: 15800 },
  { date: "Apr", sales: 81, orders: 19, revenue: 16200 },
  { date: "May", sales: 56, orders: 86, revenue: 10400 },
  { date: "Jun", sales: 75, orders: 60, revenue: 14800 },
]
const weeklyData = [
  { date: "Mon", sales: 15, orders: 5, revenue: 2800 },
  { date: "Tue", sales: 20, orders: 8, revenue: 3900 },
  { date: "Wed", sales: 18, orders: 6, revenue: 3400 },
  { date: "Thu", sales: 25, orders: 10, revenue: 4800 },
  { date: "Fri", sales: 30, orders: 12, revenue: 5900 },
]

function BusinessMetrics() {
  const [timeframe, setTimeframe] = useState("Last 6 Months")
  const [chartData, setChartData] = useState(initialChartData)
  const [chartType, setChartType] = useState<"bar" | "line" | "area">("area")

  const handleTimeframeChange = (newTimeframe: string, data: typeof initialChartData) => {
    setTimeframe(newTimeframe)
    setChartData(data)
  }
  const totalSales = chartData.reduce((acc, item) => acc + item.sales, 0)
  const totalOrders = chartData.reduce((acc, item) => acc + item.orders, 0)
  const totalRevenue = chartData.reduce((acc, item) => acc + item.revenue, 0)

  return (
    <Card className="bg-white border-0 shadow-lg rounded-xl h-full flex flex-col overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-orange-500" />
            <CardTitle className="text-base font-bold text-gray-900">Business Performance</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-md p-0.5">
              <Button
                variant={chartType === "area" ? "secondary" : "ghost"}
                size="sm"
                className="rounded px-2 h-6 text-xs"
                onClick={() => setChartType("area")}
              >
                Area
              </Button>
              <Button
                variant={chartType === "bar" ? "secondary" : "ghost"}
                size="sm"
                className="rounded px-2 h-6 text-xs"
                onClick={() => setChartType("bar")}
              >
                Bar
              </Button>
              <Button
                variant={chartType === "line" ? "secondary" : "ghost"}
                size="sm"
                className="rounded px-2 h-6 text-xs"
                onClick={() => setChartType("line")}
              >
                Line
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 gap-1 border-gray-200 bg-white hover:bg-gray-50 text-xs px-2"
                >
                  <Calendar className="h-3 w-3" />
                  {timeframe}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => handleTimeframeChange("Last 6 Months", initialChartData)}>
                  Last 6 Months
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTimeframeChange("Last Week", weeklyData)}>
                  Last Week
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-3">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="relative overflow-hidden p-2 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/50">
            <div className="relative z-10">
              <p className="text-lg font-bold text-gray-900">${(totalRevenue / 1000).toFixed(1)}k</p>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                Revenue
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50">
            <div className="relative z-10">
              <p className="text-lg font-bold text-gray-900">{totalSales}</p>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <ShoppingCart className="h-3 w-3 text-blue-500" />
                Sales
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden p-2 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50">
            <div className="relative z-10">
              <p className="text-lg font-bold text-gray-900">{totalOrders}</p>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <ClipboardList className="h-3 w-3 text-green-500" />
                Orders
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-[180px]">
          <ChartContainer
            config={{
              sales: { label: "Sales", color: "hsl(25 95% 53%)" },
              orders: { label: "Orders", color: "hsl(217 91% 60%)" },
            }}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "area" ? (
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(25 95% 53%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(25 95% 53%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={4} fontSize={10} stroke="#6b7280" />
                  <YAxis tickLine={false} axisLine={false} tickMargin={4} fontSize={10} stroke="#6b7280" />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="bg-white shadow-xl rounded-lg text-xs p-2 border-0"
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(25 95% 53%)"
                    strokeWidth={2}
                    fill="url(#salesGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(217 91% 60%)"
                    strokeWidth={2}
                    fill="url(#ordersGradient)"
                  />
                </AreaChart>
              ) : chartType === "line" ? (
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={4} fontSize={10} stroke="#6b7280" />
                  <YAxis tickLine={false} axisLine={false} tickMargin={4} fontSize={10} stroke="#6b7280" />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="bg-white shadow-xl rounded-lg text-xs p-2 border-0"
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(25 95% 53%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(25 95% 53%)", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(217 91% 60%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(217 91% 60%)", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={4} fontSize={10} stroke="#6b7280" />
                  <YAxis tickLine={false} axisLine={false} tickMargin={4} fontSize={10} stroke="#6b7280" />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="bg-white shadow-xl rounded-lg text-xs p-2 border-0"
                      />
                    }
                  />
                  <Bar dataKey="sales" fill="hsl(25 95% 53%)" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="orders" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

/* ==========================================================================
ProductsUpload Component (Quick Actions)
========================================================================== */
interface QuickActionButtonProps {
  icon: React.ElementType
  title: string
  description: string
  href: string
  gradient: string
  shadowColor: string
}

function QuickActionButton({ icon: Icon, title, description, href, gradient, shadowColor }: QuickActionButtonProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-lg bg-white p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex-1 flex items-center"
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity", gradient)} />
      <div className="relative z-10 flex items-center gap-3 w-full">
        <div className={cn("inline-flex p-3 rounded-lg bg-gradient-to-br text-white shadow-md", gradient, shadowColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
      </div>
    </Link>
  )
}

function QuickActions() {
  const actions = [
    {
      icon: PlusCircle,
      title: "Add Products",
      description: "List new items",
      href: "/products",
      gradient: "from-orange-500 to-amber-500",
      shadowColor: "shadow-orange-500/20",
    },
    {
      icon: ClipboardList,
      title: "Manage Orders",
      description: "Track and fulfill",
      href: "/orders",
      gradient: "from-blue-500 to-indigo-500",
      shadowColor: "shadow-blue-500/20",
    },
    {
      icon: CircleDollarSign,
      title: "View Balance",
      description: "Check earnings",
      href: "/balance",
      gradient: "from-green-500 to-emerald-500",
      shadowColor: "shadow-green-500/20",
    },
    {
      icon: HelpCircle,
      title: "Get Support",
      description: "Access help",
      href: "/help",
      gradient: "from-purple-500 to-pink-500",
      shadowColor: "shadow-purple-500/20",
    },
  ]

  return (
    <Card className="bg-white border-0 shadow-lg rounded-xl h-full flex flex-col p-3">
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <Sparkles className="h-4 w-4 text-orange-500" />
        <h2 className="text-base font-bold text-gray-900">Quick Actions</h2>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        {actions.map((action) => (
          <QuickActionButton
            key={action.title}
            icon={action.icon}
            title={action.title}
            description={action.description}
            href={action.href}
            gradient={action.gradient}
            shadowColor={action.shadowColor}
          />
        ))}
      </div>
    </Card>
  )
}

/* ==========================================================================
Main Dashboard Page Component
========================================================================== */

export default function DashboardPage() {
  const currentSellerScore = 88
  const sellerPulseTrend: "improving" | "declining" | "stable" = "improving"

  return (
    <main className="flex-1 p-3 lg:p-4 overflow-hidden bg-gray-50/50 h-screen">
      <div className="max-w-[1600px] mx-auto h-full flex flex-col gap-3">
        {/* Header Section - Compact */}
        <div className="flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-sm text-gray-600">Here's what's happening with your store today.</p>
        </div>

        {/* Top Section - Combined */}
        <div className="flex-shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-3">
          <OnboardingProgress />
          <Notification
            title="Platform Updates & Seller Tips!"
            message="Discover new features to boost your sales."
            isNew
          />
        </div>

        {/* Stats Grid - Compact */}
        <div className="flex-shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <DashboardStats />
        </div>

        {/* Main Content Grid - Fill remaining space */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 min-h-0">
          {/* Business Metrics - Takes 2 columns */}
          <div className="lg:col-span-2 min-h-0">
            <BusinessMetrics />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-3 min-h-0">
            <div className="flex-shrink-0">
              <SellerPulse score={currentSellerScore} trend={sellerPulseTrend} />
            </div>
            <div className="flex-1 min-h-0">
              <QuickActions />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
