import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, Clock } from "lucide-react"
import type { Earnings } from "@/types/associate"

interface EarningsOverviewProps {
  earnings: Earnings
}

export function EarningsOverview({ earnings }: EarningsOverviewProps) {
  const monthChange = earnings.thisMonth - earnings.lastMonth
  const monthChangePercent = earnings.lastMonth > 0 ? (monthChange / earnings.lastMonth) * 100 : 0
  const isPositiveChange = monthChange >= 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Earned</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold text-foreground">
            {earnings.currency} {earnings.totalEarned.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">All time earnings</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          {isPositiveChange ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold text-foreground">
            {earnings.currency} {earnings.thisMonth.toLocaleString()}
          </div>
          <p className={`text-xs mt-1 ${isPositiveChange ? "text-success" : "text-destructive"}`}>
            {isPositiveChange ? "+" : ""}
            {monthChangePercent.toFixed(1)}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Last Month</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold text-foreground">
            {earnings.currency} {earnings.lastMonth.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Previous period</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          <Clock className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold text-foreground">
            {earnings.currency} {earnings.pendingPayments.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
        </CardContent>
      </Card>
    </div>
  )
}
