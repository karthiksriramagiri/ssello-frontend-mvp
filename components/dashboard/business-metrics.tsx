"use client"

import { useState, useEffect, useMemo } from "react"
import { TrendingUp, ShoppingCart, BarChart3, CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { DateRange } from "react-day-picker"
import { format, subDays, eachDayOfInterval, startOfDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Helper to generate more realistic daily mock data
const generateDailyData = (startDate: Date, numDays: number) => {
  const data = []
  for (let i = 0; i < numDays; i++) {
    const currentDate = subDays(startDate, numDays - 1 - i)
    data.push({
      date: currentDate,
      // Random-ish data for sales and orders
      sales: Math.floor(Math.random() * (120 - 30 + 1) + 30), // Sales between $30k and $120k
      orders: Math.floor(Math.random() * (100 - 10 + 1) + 10), // Orders between 10 and 100
    })
  }
  return data
}

// Generate data for the last 90 days ending today
const FULL_CHART_DATA_DAYS = 90
const fullChartData = generateDailyData(new Date(), FULL_CHART_DATA_DAYS)

export function BusinessMetrics() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 6), // Default to the last 7 days
    to: new Date(),
  })

  const [chartData, setChartData] = useState<typeof fullChartData>([])

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const from = startOfDay(dateRange.from)
      const to = startOfDay(dateRange.to)

      const filtered = fullChartData.filter((item) => {
        const itemDate = startOfDay(item.date)
        return itemDate >= from && itemDate <= to
      })
      setChartData(filtered)
    } else if (dateRange?.from) {
      // Handle single date selection if needed, or default to a range
      const from = startOfDay(dateRange.from)
      const filtered = fullChartData.filter((item) => startOfDay(item.date) >= from)
      setChartData(filtered)
    } else {
      // If no range, show all data or a default subset. For now, empty if no valid range.
      // Or, set to default past week if range becomes undefined
      const defaultFrom = startOfDay(subDays(new Date(), 6))
      const defaultTo = startOfDay(new Date())
      const defaultFiltered = fullChartData.filter((item) => {
        const itemDate = startOfDay(item.date)
        return itemDate >= defaultFrom && itemDate <= defaultTo
      })
      setChartData(defaultFiltered)
    }
  }, [dateRange])

  const { totalSales, totalOrders } = useMemo(() => {
    return chartData.reduce(
      (acc, item) => {
        acc.totalSales += item.sales
        acc.totalOrders += item.orders
        return acc
      },
      { totalSales: 0, totalOrders: 0 },
    )
  }, [chartData])

  const chartConfig = {
    sales: { label: "Sales ($k)", color: "hsl(var(--primary))" },
    orders: { label: "Orders", color: "hsl(var(--chart-2))" },
  }

  let timeframeDescription = "Showing data for selected range"
  if (dateRange?.from) {
    if (dateRange.to) {
      timeframeDescription = `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
    } else {
      timeframeDescription = `From ${format(dateRange.from, "LLL dd, y")}`
    }
  } else {
    timeframeDescription = `Select a date range to view metrics (Default: Last ${FULL_CHART_DATA_DAYS} days)`
  }

  const placeholder = "Select date range"
  const buttonClassName = "h-9 text-xs px-3 rounded-md w-full sm:w-auto max-w-xs"

  const xAxisFormatter = (date: Date) => {
    if (!date) return ""
    // Show more detail if the range is small, less if it's large
    const dayCount =
      dateRange?.from && dateRange?.to ? eachDayOfInterval({ start: dateRange.from, end: dateRange.to }).length : 0
    if (dayCount <= 14) return format(date, "MMM d") // e.g., Jan 5
    return format(date, "MMM yy") // e.g., Jan 23
  }

  return (
    <Card className="bg-card shadow-sm rounded-lg h-full flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 pt-4 px-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle className="text-base font-medium text-foreground">Business Metrics</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">{timeframeDescription}</CardDescription>
          </div>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600",
                !dateRange && "text-muted-foreground",
                buttonClassName,
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={1}
              disabled={(date) => date > new Date() || date < subDays(new Date(), FULL_CHART_DATA_DAYS)}
            />
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-2 px-4 pb-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex items-center p-2.5 rounded-lg bg-muted/50 ">
            <div className="p-2 bg-primary/10 rounded-md mr-2.5">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Sales</p>
              <p className="text-sm font-semibold text-foreground">${totalSales.toFixed(0)}k</p>
            </div>
          </div>
          <div className="flex items-center p-2.5 rounded-lg bg-muted/50">
            <div className="p-2 bg-sky-500/10 rounded-md mr-2.5">
              <ShoppingCart className="h-4 w-4 text-sky-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Orders</p>
              <p className="text-sm font-semibold text-foreground">{totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-[200px]">
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border) / 0.2)" strokeDasharray="4 4" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    fontSize={11}
                    className="text-muted-foreground"
                    tickFormatter={xAxisFormatter}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={11}
                    className="text-muted-foreground"
                    domain={[0, (dataMax: number) => Math.ceil((dataMax * 1.2) / 10) * 10]}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    cursor={{ stroke: "hsl(var(--muted-foreground) / 0.3)", strokeWidth: 1, strokeDasharray: "3 3" }}
                    content={
                      <ChartTooltipContent
                        indicator="line"
                        labelFormatter={(value) => format(new Date(value), "PP")} // Format date in tooltip
                        className="bg-popover text-popover-foreground shadow-md rounded-lg text-xs p-2.5 border border-border/30"
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="var(--color-sales)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--background))", fill: "var(--color-sales)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="var(--color-orders)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--background))", fill: "var(--color-orders)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No data available for the selected range.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
