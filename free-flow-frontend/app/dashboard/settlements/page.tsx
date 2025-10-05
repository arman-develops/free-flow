"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  Plus,
  Calendar,
  User,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { RecordSettlementDialog } from "@/components/dashboard/record-settlement-dialog"

// Mock data - replace with actual API calls
const settlementStats = {
  totalPayable: 45000,
  settledThisMonth: 28000,
  outstandingBalance: 17000,
  pendingSettlements: 5,
  averageSettlementTime: 3.5,
  totalAssociates: 12,
}

const settlements = [
  {
    id: "1",
    associate: "Sarah Johnson",
    amount: 5000,
    currency: "KES",
    status: "completed",
    method: "mpesa",
    transactionRef: "MPE123456",
    date: "2025-01-15T10:30:00Z",
    project: "Website Redesign",
  },
  {
    id: "2",
    associate: "Mike Chen",
    amount: 3500,
    currency: "KES",
    status: "pending",
    method: "bank_transfer",
    transactionRef: null,
    date: "2025-01-20T14:15:00Z",
    project: "Mobile App Development",
  },
  {
    id: "3",
    associate: "John Doe",
    amount: 4200,
    currency: "KES",
    status: "completed",
    method: "mpesa",
    transactionRef: "MPE789012",
    date: "2025-01-18T09:45:00Z",
    project: "E-commerce Platform",
  },
  {
    id: "4",
    associate: "Sarah Johnson",
    amount: 6000,
    currency: "KES",
    status: "processing",
    method: "bank_transfer",
    transactionRef: "BNK345678",
    date: "2025-01-22T11:20:00Z",
    project: "Brand Identity Design",
  },
  {
    id: "5",
    associate: "Mike Chen",
    amount: 2800,
    currency: "KES",
    status: "completed",
    method: "mpesa",
    transactionRef: "MPE901234",
    date: "2025-01-12T16:00:00Z",
    project: "Portfolio Website",
  },
]

const settlementHistory = [
  { month: "Jan 2025", amount: 28000, count: 8 },
  { month: "Dec 2024", amount: 32000, count: 10 },
  { month: "Nov 2024", amount: 25000, count: 7 },
  { month: "Oct 2024", amount: 29000, count: 9 },
  { month: "Sep 2024", amount: 31000, count: 11 },
  { month: "Aug 2024", amount: 27000, count: 8 },
]

export default function SettlementsPage() {
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`
  }

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Wallet className="h-8 w-8" />
                Associate Settlements
              </h1>
              <p className="text-muted-foreground">Track and manage payments to your associates</p>
            </div>
            <Button
              onClick={() => setIsRecordDialogOpen(true)}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" />
              Record Settlement
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Payable</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  KES {settlementStats.totalPayable.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Settled This Month</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  KES {settlementStats.settledThisMonth.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((settlementStats.settledThisMonth / settlementStats.totalPayable) * 100).toFixed(0)}% of total
                  payable
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Outstanding Balance</CardTitle>
                <TrendingDown className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  KES {settlementStats.outstandingBalance.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <span className="text-orange-600">{settlementStats.pendingSettlements} pending</span> settlements
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Avg. Settlement Time</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{settlementStats.averageSettlementTime} days</div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <ArrowDownRight className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">-0.5 days</span> improvement
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-gray-200 shadow-sm bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Associates</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{settlementStats.totalAssociates}</p>
                  </div>
                  <User className="h-10 w-10 text-blue-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm bg-gradient-to-br from-green-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Payment Success Rate</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">98.5%</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">156</p>
                  </div>
                  <Wallet className="h-10 w-10 text-purple-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settlement Table */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-medium text-gray-900">Recent Settlements</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Associate</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction Ref</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlements.map((settlement) => (
                    <TableRow key={settlement.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="font-medium text-sm">{settlement.associate}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{settlement.project}</TableCell>
                      <TableCell className="font-semibold text-sm">
                        {formatCurrency(settlement.amount, settlement.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">
                          {settlement.method.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(settlement.status)}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(settlement.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-gray-500">
                        {settlement.transactionRef || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Settlement History */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-medium text-gray-900">Settlement History</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {settlementHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.month}</p>
                        <p className="text-sm text-gray-500">{item.count} settlements</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">KES {item.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        Avg: KES {Math.round(item.amount / item.count).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Record Settlement Dialog */}
      <RecordSettlementDialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen} />
    </div>
  )
}
