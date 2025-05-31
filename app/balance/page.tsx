"use client"

import type React from "react"
import { useState } from "react"
import {
  ArrowUpDown,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  CreditCard,
  Wallet,
  CircleDollarSign,
  ChevronRight,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Transaction {
  id: string
  date: string
  type: "sale" | "payout" | "fee" | "refund"
  description: string
  amount: number
  status: "completed" | "pending" | "processing"
  reference?: string
}

interface BalanceStatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: number
  gradient?: string
  description?: string
}

function BalanceStatCard({ title, value, icon: Icon, trend, gradient = "from-blue-500 to-indigo-500", description }: BalanceStatCardProps) {
  return (
    <Card className="relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity", gradient)} />
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={cn("p-2.5 bg-gradient-to-br text-white rounded-xl shadow-lg", gradient)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="relative pb-4 px-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-900">{value}</div>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
          {trend !== undefined && (
            <div className={cn("flex items-center text-sm font-medium", trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-500")}>
              {trend > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : trend < 0 ? <ArrowDownRight className="w-4 h-4 mr-1" /> : null}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-15",
    type: "payout",
    description: "Bi-weekly Payout - Jan 1-14, 2024",
    amount: -2547.26,
    status: "completed",
    reference: "PAY-2024-01-B",
  },
  {
    id: "2",
    date: "2024-01-01",
    type: "payout",
    description: "Bi-weekly Payout - Dec 16-31, 2023",
    amount: -1850.00,
    status: "completed",
    reference: "PAY-2023-12-B",
  },
  {
    id: "3",
    date: "2023-12-15",
    type: "payout",
    description: "Bi-weekly Payout - Dec 1-15, 2023",
    amount: -2100.00,
    status: "completed",
    reference: "PAY-2023-12-A",
  },
  {
    id: "4",
    date: "2023-12-01",
    type: "payout",
    description: "Bi-weekly Payout - Nov 16-30, 2023",
    amount: -1875.50,
    status: "completed",
    reference: "PAY-2023-11-B",
  },
  {
    id: "5",
    date: "2023-11-15",
    type: "payout",
    description: "Bi-weekly Payout - Nov 1-15, 2023",
    amount: -2200.75,
    status: "completed",
    reference: "PAY-2023-11-A",
  },
  {
    id: "6",
    date: "2023-11-01",
    type: "payout",
    description: "Bi-weekly Payout - Oct 16-31, 2023",
    amount: -1925.00,
    status: "completed",
    reference: "PAY-2023-10-B",
  },
  {
    id: "7",
    date: "2023-10-15",
    type: "payout",
    description: "Bi-weekly Payout - Oct 1-15, 2023",
    amount: -2050.25,
    status: "completed",
    reference: "PAY-2023-10-A",
  },
  {
    id: "8",
    date: "2023-10-01",
    type: "payout",
    description: "Bi-weekly Payout - Sep 16-30, 2023",
    amount: -1750.00,
    status: "completed",
    reference: "PAY-2023-09-B",
  },
]

interface BalanceSheetData {
  sales: number
  cancellations: number
  fees: number
  subscriptionFees: number
  other: number
  total: number
}

const currentBalanceSheet: BalanceSheetData = {
  sales: 12500.75,
  cancellations: -350.20,
  fees: -120.50,
  subscriptionFees: -49.99,
  other: -15.00,
  total: 11965.06,
}

export default function BalancePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showBalanceSheet, setShowBalanceSheet] = useState(false)

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.reference && transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesSearch
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "sale":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "payout":
        return <ArrowDownRight className="h-4 w-4 text-blue-500" />
      case "fee":
        return <CreditCard className="h-4 w-4 text-orange-500" />
      case "refund":
        return <TrendingDown className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: Transaction["status"]) => {
    const statusClasses = {
      completed: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200",
      pending: "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 border-amber-200",
      processing: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200",
    }

    const statusIcons = {
      completed: <CheckCircle2 className="h-3 w-3" />,
      pending: <Clock className="h-3 w-3" />,
      processing: <AlertCircle className="h-3 w-3" />,
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusClasses[status]}`}>
        {statusIcons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const totalBalance = 2847.25
  const pendingBalance = 299.99
  const availableBalance = totalBalance - pendingBalance
  const lastPayoutAmount = 2547.26
  const lastPayoutDate = "Jan 15, 2024"

  return (
    <>
      <main className="flex-1 flex flex-col p-6 md:p-8 gap-6 bg-gray-50/50 overflow-y-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Balance</h1>
            <p className="text-gray-600 mt-1">Monitor your earnings and financial transactions</p>
          </div>
          <Button variant="outline" className="bg-white hover:bg-gray-50 border-gray-200 rounded-lg shadow-sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <BalanceStatCard
            title="Available Balance"
            value={`$${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            icon={Wallet}
            gradient="from-green-500 to-emerald-500"
            trend={12}
            description="Ready for payout"
          />
          <BalanceStatCard
            title="Pending Balance"
            value={`$${pendingBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            icon={Clock}
            gradient="from-yellow-500 to-amber-500"
            description="Processing orders"
          />
          <BalanceStatCard
            title="Total Earnings"
            value="$12,847.00"
            icon={TrendingUp}
            gradient="from-blue-500 to-indigo-500"
            trend={8}
            description="Current period"
          />
          <BalanceStatCard
            title="Last Payout"
            value={`$${lastPayoutAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            icon={CircleDollarSign}
            gradient="from-purple-500 to-pink-500"
            description={lastPayoutDate}
          />
        </div>

        <Card className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                Payout History
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-3 py-2 h-9 w-64 bg-white border-gray-200 rounded-lg hover:border-blue-300 focus:border-blue-400 transition-all duration-200"
                  />
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                  <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">Type</TableHead>
                  <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">Description</TableHead>
                  <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(transaction.type)}
                          <span className="text-sm font-medium text-gray-700 capitalize">{transaction.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div>
                          <p className="text-sm text-gray-900">{transaction.description}</p>
                          {transaction.reference && (
                            <p className="text-xs text-gray-500">{transaction.reference}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        <span className={cn(
                          "text-sm font-semibold",
                          transaction.amount > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-500">No transactions found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl shadow-lg">
                <CircleDollarSign className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Next Payout Schedule</h3>
                <p className="text-sm text-gray-600">Your next payout is scheduled for January 31, 2024</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowBalanceSheet(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg shadow-md"
            >
              View Details
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </Card>
      </main>

      {/* Balance Sheet Modal */}
      <Dialog open={showBalanceSheet} onOpenChange={setShowBalanceSheet}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Building2 className="h-5 w-5 text-orange-500" />
              Balance Sheet
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Sales</span>
                <span className="text-sm font-semibold text-gray-900">
                  US$ {currentBalanceSheet.sales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-red-600">Cancellations</span>
                <span className="text-sm font-semibold text-red-600">
                  US$ {currentBalanceSheet.cancellations.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-red-600">Fees</span>
                <span className="text-sm font-semibold text-red-600">
                  US$ {currentBalanceSheet.fees.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-red-600">Subscription Fees</span>
                <span className="text-sm font-semibold text-red-600">
                  US$ {currentBalanceSheet.subscriptionFees.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-red-600">Other</span>
                <span className="text-sm font-semibold text-red-600">
                  US$ {currentBalanceSheet.other.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-base font-bold text-orange-600">Total</span>
              <span className="text-base font-bold text-orange-600">
                US$ {currentBalanceSheet.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
