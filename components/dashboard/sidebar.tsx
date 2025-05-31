"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Package, ClipboardList, CircleDollarSign, Gauge, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItemProps {
  icon: React.ElementType
  title: string
  isActive?: boolean
  href: string
  gradient?: string
}

function NavItem({ icon: Icon, title, isActive, href, gradient = "from-blue-500 to-indigo-500" }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative group flex flex-col items-center justify-center py-3 mx-2 rounded-xl transition-all duration-300 h-20",
        isActive 
          ? "bg-gradient-to-r from-orange-500/10 to-amber-500/10 shadow-md" 
          : "hover:bg-gray-50 hover:shadow-md"
      )}
    >
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl blur-xl" />
      )}
      <div className={cn(
        "relative z-10 p-2 rounded-lg transition-all duration-300",
        isActive 
          ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30" 
          : "group-hover:bg-gradient-to-br group-hover:from-gray-100 group-hover:to-gray-200"
      )}>
        <Icon className={cn(
          "h-5 w-5",
          isActive ? "text-white" : "text-gray-600 group-hover:text-gray-800"
        )} />
      </div>
      <span className={cn(
        "text-xs font-medium text-center mt-1 transition-colors",
        isActive ? "text-orange-700" : "text-gray-600 group-hover:text-gray-800"
      )}>
        {title}
      </span>
    </Link>
  )
}

export function DashboardSidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", title: "Dashboard", icon: BarChart3, gradient: "from-orange-500 to-amber-500" },
    { href: "/products", title: "Products", icon: Package, gradient: "from-blue-500 to-indigo-500" },
    { href: "/orders", title: "Orders", icon: ClipboardList, gradient: "from-green-500 to-emerald-500" },
    { href: "/balance", title: "Balance", icon: CircleDollarSign, gradient: "from-purple-500 to-pink-500" },
    { href: "/seller-pulse", title: "Seller Pulse", icon: Gauge, gradient: "from-red-500 to-rose-500" },
    { href: "/help", title: "Help Center", icon: HelpCircle, gradient: "from-cyan-500 to-teal-500" },
  ]

  return (
    <div className="flex flex-col bg-white border-r border-gray-200 w-[100px] shadow-lg">
      <div className="relative flex items-center h-28 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <span className="absolute right-2 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 bg-clip-text text-transparent">
          ssello
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            title={item.title}
            icon={item.icon}
            isActive={pathname.startsWith(item.href)}
            gradient={item.gradient}
          />
        ))}
      </nav>
      <div className="mt-auto p-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full blur-md animate-pulse" />
            <div className="relative h-2 w-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
