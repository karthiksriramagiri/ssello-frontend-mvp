import type { Metadata } from "next"
import DashboardPage from "./dashboard-page"

export const metadata: Metadata = {
  title: "NocNoc Seller Dashboard - Single View",
  description: "Compact, single-view seller dashboard for NocNoc.",
}

export default function Page() {
  return <DashboardPage />
}
