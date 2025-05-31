// This file can be created to abstract the common dashboard layout (sidebar + header + main content area)
// For now, the layout structure is directly in app/dashboard/page.tsx and app/products/page.tsx
// If more dashboard pages are added, refactoring to this layout component would be beneficial.

import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen max-h-screen bg-slate-100 overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        {children}
      </div>
    </div>
  )
}
