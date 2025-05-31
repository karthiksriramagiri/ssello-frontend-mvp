"use client"

import React from "react"
import { useState } from "react"
import { HelpCircle, Info, TrendingUp, TrendingDown, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress" // Using the modified progress from ui
import { cn } from "@/lib/utils"

interface MetricItemProps {
  title: string
  value: string
  target?: string
  progress: number
  icon: React.ReactNode
  iconColor?: string
  progressColor?: string
}

function MetricItem({
  title,
  value,
  target,
  progress,
  icon,
  iconColor = "text-primary",
  progressColor = "bg-primary",
}: MetricItemProps) {
  return (
    <div className="p-3 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "p-1 rounded-full bg-opacity-20",
              iconColor === "text-primary"
                ? "bg-orange-100"
                : iconColor === "text-green-500"
                  ? "bg-green-100"
                  : "bg-red-100",
            )}
          >
            {React.cloneElement(icon as React.ReactElement, { className: cn("h-4 w-4", iconColor) })}
          </div>
          <h4 className="text-xs font-medium text-muted-foreground">{title}</h4>
        </div>
        <span className="text-sm font-semibold text-foreground">{value}</span>
      </div>
      <Progress value={progress} className="h-1.5 bg-slate-200" indicatorClassName={progressColor} />
      {target && <p className="text-[10px] text-muted-foreground mt-1 text-right">Target: {target}</p>}
    </div>
  )
}

export function SellerReputation() {
  const [rating] = useState(4.8) // Example rating

  return (
    <Card className="bg-card shadow-sm rounded-lg h-full flex flex-col">
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold text-foreground">Seller Reputation</CardTitle>
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-primary">
                    <HelpCircle className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs p-2">
                  <p>Your seller reputation affects visibility and customer trust. Aim for green!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary hover:text-primary/80">
            <Info className="h-3 w-3 mr-1" />
            How to improve?
          </Button>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Current rating: <span className="font-semibold text-orange-600">{rating}/5</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 pb-4 flex-1">
        <MetricItem
          title="Cancellation Rate (Seller)"
          value="1.2%"
          target="< 2%"
          progress={((2 - 1.2) / 2) * 100} // Lower is better
          icon={<XCircle />}
          iconColor="text-red-500"
          progressColor="bg-red-500"
        />
        <MetricItem
          title="Late Shipment Rate"
          value="0.5%"
          target="< 4%"
          progress={((4 - 0.5) / 4) * 100} // Lower is better
          icon={<TrendingDown />}
          iconColor="text-green-500"
          progressColor="bg-green-500"
        />
        <MetricItem
          title="On-Time Delivery"
          value="98.5%"
          target="> 95%"
          progress={98.5}
          icon={<CheckCircle />}
          iconColor="text-green-500"
          progressColor="bg-green-500"
        />
        <MetricItem
          title="Valid Tracking Rate"
          value="99.2%"
          target="> 98%"
          progress={99.2}
          icon={<TrendingUp />}
          iconColor="text-green-500"
          progressColor="bg-green-500"
        />
      </CardContent>
    </Card>
  )
}
