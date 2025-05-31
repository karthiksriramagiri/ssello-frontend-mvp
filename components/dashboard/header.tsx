"use client"

import { useState } from "react"
import { Bell, HelpCircle, Search, User, Settings, LogOut, Globe, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function DashboardHeader() {
  const [showSearch, setShowSearch] = useState(false)
  const [hasNotifications, setHasNotifications] = useState(true)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-white border-b border-gray-200 px-6 md:px-8 shadow-sm">
      <div className="hidden md:block flex-1">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
          <Input
            type="search"
            placeholder="Search products, orders..."
            className="w-full max-w-md pl-10 bg-gray-50 border-gray-200 rounded-xl hover:bg-white hover:border-orange-300 focus:bg-white focus:border-orange-400 transition-all duration-200 shadow-sm"
          />
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden hover:bg-orange-50 rounded-xl" 
        onClick={() => setShowSearch(!showSearch)}
      >
        <Search className="h-5 w-5 text-gray-600" />
      </Button>
      
      <div
        className={cn(
          "absolute top-16 left-0 right-0 p-4 bg-white border-b border-gray-200 shadow-lg md:hidden transition-all duration-300",
          showSearch ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            type="search" 
            placeholder="Search products, orders..." 
            className="w-full pl-10 bg-gray-50 border-gray-200 rounded-xl"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3 ml-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-orange-50 rounded-xl group"
        >
          <Bell className="h-5 w-5 text-gray-600 group-hover:text-orange-500 transition-colors" />
          {hasNotifications && (
            <span className="absolute top-2 right-2 h-2 w-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-full animate-pulse" />
          )}
        </Button>
        
        <Link href="/help" passHref>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-blue-50 rounded-xl group"
          >
            <HelpCircle className="h-5 w-5 text-gray-600 group-hover:text-blue-500 transition-colors" />
          </Button>
        </Link>
        
        <div className="h-8 w-px bg-gray-200" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="relative h-8 w-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-0 p-2">
            <DropdownMenuLabel className="px-3 py-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">john@example.com</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-2" />
            <DropdownMenuItem className="rounded-lg hover:bg-orange-50 cursor-pointer">
              <UserCircle className="mr-2 h-4 w-4 text-orange-500" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg hover:bg-blue-50 cursor-pointer">
              <Settings className="mr-2 h-4 w-4 text-blue-500" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg hover:bg-green-50 cursor-pointer">
              <Globe className="mr-2 h-4 w-4 text-green-500" />
              <span>Language</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="mx-2" />
            <DropdownMenuItem className="rounded-lg hover:bg-red-50 cursor-pointer text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
