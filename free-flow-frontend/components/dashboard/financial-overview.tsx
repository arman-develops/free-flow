"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle } from "lucide-react"

const financialData = {
  totalRevenue: 45650,
  monthlyRevenue: 12450,
  pendingPayments: 8750,
  overduePayments: 2300,
  revenueGrowth: 15.2,
  profitMargin: 68.5,
}

const recentPayments = [
  {
    id: 1,
    client: "TechCorp Inc.",
    project: "Website Redesign",
    amount: 3500,
    status: "paid",
    date: "Dec 10",
    method: "project",
  },
  {
    id: 2,
    client: "StartupXYZ",
    project: "Mobile App - Phase 1",
    amount: 2250,
    status: "pending",
    date: "Dec 15",
    method: "task",
  },
  {
    id: 3,
    client: "RetailCorp",
    project: "E-commerce Platform",
    amount: 4000,
    status: "overdue",
    date: "Dec 5",
    method: "project",
  },
]

const getPaymentStatusIcon = (status: string) => {
  switch (status) {
    case "paid":
      return <CheckCircle className="h-4 w-4 text-secondary" />
    case "pending":
      return <Clock className="h-4 w-4 text-primary" />
    case "overdue":
      return <TrendingDown className="h-4 w-4 text-destructive" />
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />
  }
}

const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <Badge variant="secondary">Paid</Badge>
    case "pending":
      return <Badge variant="default">Pending</Badge>
    case "overdue":
      return <Badge variant="destructive">Overdue</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export function FinancialOverview() {
  return (
    <div className="space-y-6">
      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${financialData.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">${financialData.monthlyRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-xs text-secondary">
                  <TrendingUp className="h-3 w-3" />+{financialData.revenueGrowth}%
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold">${financialData.pendingPayments.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-destructive">${financialData.overduePayments.toLocaleString()}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  {getPaymentStatusIcon(payment.status)}
                  <div>
                    <p className="text-sm font-medium">{payment.client}</p>
                    <p className="text-xs text-muted-foreground">{payment.project}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {payment.method}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Due: {payment.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">${payment.amount.toLocaleString()}</p>
                  {getPaymentStatusBadge(payment.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
