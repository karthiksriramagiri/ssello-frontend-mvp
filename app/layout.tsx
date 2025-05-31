import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
// Remove ThemeProvider as we are no longer supporting dark mode
// import { ThemeProvider } from "@/components/theme-provider"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Ssello - Sell in Latin America",
  description: "Reinventing the way you sell in Latin America",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Removed ThemeProvider wrapper and class from body */}
      <body className={poppins.className}>
        <div className="flex h-screen max-h-screen bg-gray-50/50 overflow-hidden">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader />
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
