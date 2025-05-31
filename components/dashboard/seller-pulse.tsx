"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

interface SellerPulseProps {
  score: number
  title?: string
  trend?: "improving" | "declining" | "stable"
}

const Gauge = ({
  value,
  size = 100, // Default size from previous adjustment
  strokeWidth = 10, // Default strokeWidth from previous adjustment
  color,
}: {
  value: number
  size?: number
  strokeWidth?: number
  color: string
}) => {
  const cx = size / 2
  const cy = size / 2
  const radius = (size - strokeWidth) / 2
  const circumference = radius * Math.PI // Circumference of a semi-circle

  // Calculate the offset for the value arc
  // Arc sweeps from left (0 value) to right (100 value)
  const progressPercentage = Math.max(0, Math.min(100, value)) / 100
  const offset = circumference * (1 - progressPercentage)

  // Calculate needle rotation angle
  // 0 value = 0 degrees rotation (points left)
  // 50 value = 90 degrees rotation (points up)
  // 100 value = 180 degrees rotation (points right)
  const rotationAngle = progressPercentage * 180

  // Define needle geometry (base needle points left)
  const needleLength = radius * 0.85 // Length of the needle
  const needleBaseWidth = strokeWidth * 0.6 // Width of the needle base

  // Tip of the needle (when pointing left, before rotation)
  const needleTipX_base = cx - needleLength
  const needleTipY_base = cy

  // Base points of the needle (forms a triangle)
  // A small offset to make the base slightly behind the pivot
  const needleBasePivotOffsetX = strokeWidth * 0.2
  const needleBasePt1X = cx + needleBasePivotOffsetX
  const needleBasePt1Y = cy - needleBaseWidth / 2
  const needleBasePt2X = cx + needleBasePivotOffsetX
  const needleBasePt2Y = cy + needleBaseWidth / 2

  return (
    <div className="relative" style={{ width: size, height: size / 2 + strokeWidth / 2 }}>
      <svg width={size} height={size / 2 + strokeWidth / 2} viewBox={`0 0 ${size} ${size / 2 + strokeWidth / 2}`}>
        <defs>
          <linearGradient id={`gradient-pulse-${color.replace(/[^a-zA-Z0-9]/g, "")}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Background track */}
        <path
          d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
          fill="none"
          stroke="hsl(var(--border) / 0.5)"
          strokeWidth={strokeWidth * 0.7}
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
          fill="none"
          stroke={`url(#gradient-pulse-${color.replace(/[^a-zA-Z0-9]/g, "")})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.65, 0, 0.35, 1)" }}
        />
        {/* Needle */}
        <polygon
          points={`${needleTipX_base},${needleTipY_base} ${needleBasePt1X},${needleBasePt1Y} ${needleBasePt2X},${needleBasePt2Y}`}
          fill={color}
          style={{
            transition: "transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
            transformOrigin: `${cx}px ${cy}px`,
            transform: `rotate(${rotationAngle}deg)`,
          }}
        />
        {/* Central pivot point */}
        <circle
          cx={cx}
          cy={cy}
          r={strokeWidth * 0.35} // Slightly larger pivot
          fill="hsl(var(--background))"
          stroke={color}
          strokeWidth="1.5"
        />
        <circle
          cx={cx}
          cy={cy}
          r={strokeWidth * 0.18} // Inner dot for pivot
          fill={color}
        />
      </svg>
    </div>
  )
}

export function SellerPulse({ score, title = "Seller Pulse", trend = "stable" }: SellerPulseProps) {
  const normalizedScore = Math.max(0, Math.min(100, score))

  let scoreColor = "hsl(var(--primary))"
  let bgColor = "bg-orange-50"
  let borderColor = "border-orange-100" // Lighter border
  let statusText = "Good Standing"

  if (normalizedScore < 40) {
    scoreColor = "hsl(0 84.2% 60.2%)"
    bgColor = "bg-red-50"
    borderColor = "border-red-100"
    statusText = "Needs Attention"
  } else if (normalizedScore < 70) {
    scoreColor = "hsl(45 93% 47%)"
    bgColor = "bg-yellow-50"
    borderColor = "border-yellow-100"
    statusText = "Fair Performance"
  } else {
    scoreColor = "hsl(142.1 70.6% 45.3%)"
    bgColor = "bg-green-50"
    borderColor = "border-green-100"
    statusText = "Excellent!"
  }

  let trendIconElement = <Minus />
  let trendText = "Stable"
  let trendColor = "text-slate-500"

  if (trend === "improving") {
    trendIconElement = <ArrowUpRight />
    trendText = "Improving"
    trendColor = "text-green-600"
  } else if (trend === "declining") {
    trendIconElement = <ArrowDownRight />
    trendText = "Declining"
    trendColor = "text-red-600"
  }

  return (
    <Card
      className={cn(
        "shadow-md rounded-lg flex flex-col p-0 overflow-hidden border", // shadow-md, lighter border
        bgColor,
        borderColor,
      )}
    >
      <CardHeader className="pt-2 px-2.5 pb-0.5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold text-slate-700">{title}</CardTitle>{" "}
          {/* Slightly smaller but still clear */}
          <div className={cn("flex items-center gap-1 text-[0.6rem]", trendColor)}>
            {" "}
            {/* Smaller trend text */}
            {React.cloneElement(trendIconElement, { className: "h-2 w-2" })}
            <span className="font-medium">{trendText}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-2 pt-0.5">
        {" "}
        {/* Reduced top padding */}
        <Gauge value={normalizedScore} color={scoreColor} size={100} strokeWidth={10} /> {/* Gauge size prop */}
        <div className="mt-1.5 text-center">
          {" "}
          {/* Added mt-2 for spacing */}
          <span className="text-2xl font-bold" style={{ color: scoreColor }}>
            {normalizedScore}
          </span>
          <span className="text-sm font-medium text-slate-500 ml-0.5" style={{ color: scoreColor, opacity: 0.75 }}>
            /100
          </span>
        </div>
        <p className={cn("text-xs font-medium mt-0.5", `text-[${scoreColor}]`)} style={{ color: scoreColor }}>
          {" "}
          {/* Use inline style for color */}
          {statusText}
        </p>
      </CardContent>
    </Card>
  )
}
