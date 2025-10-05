"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export function FinanceStats() {

  const {
    data: financeStatsResponse,
    isLoading,
    error
  } = useQuery({
    queryKey: ["finance_stats"],
    queryFn: statsApi.getFinanceStats
  })

  if(isLoading) {
    return (
      <div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600">Failed to load Dashboard</p>
            <p className="text-sm text-muted-foreground">Please try again later</p>
            <p>{`${error}`}</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  const financeStats = financeStatsResponse.success ? financeStatsResponse.data : {}
  const stats = [
    {
      title: "Total Revenue",
      value: `KES ${financeStats.total_revenue?.toLocaleString() || 0}`,
      change: `${financeStats.annual_revenue_change?.toFixed(1) || 0}%`,
      changeType: financeStats.annual_revenue_change >= 0 ? "positive" : "negative" as const,
      icon: DollarSign,
      description: "This year",
    },
    {
      title: "Monthly Revenue",
      value: `KES ${financeStats.monthly_revenue?.toLocaleString() || 0}`,
      change: `${financeStats.monthly_revenue_change?.toFixed(1) || 0}%`,
      changeType: financeStats.monthly_revenue_change >= 0 ? "positive" : "negative" as const,
      icon: TrendingUp,
      description: "This month",
    },
    {
      title: "Total Expenses",
      value: `KES ${financeStats.total_expenses?.toLocaleString() || 0}`,
      change: `${financeStats.monthly_expenses_change?.toFixed(1) || 0}%`,
      changeType: financeStats.monthly_expenses_change >= 0 ? "negative" : "positive" as const, // ↑ expenses = bad
      icon: TrendingDown,
      description: "This year",
    },
    {
      title: "Net Profit",
      value: `KES ${financeStats.net_profit?.toLocaleString() || 0}`,
      change: `${financeStats.annual_net_change?.toFixed(1) || 0}%`,
      changeType: financeStats.annual_net_change >= 0 ? "positive" : "negative" as const,
      icon: CheckCircle,
      description: "This year",
    },
    {
      title: "Pending Payments",
      value: `KES ${financeStats.pending_payments?.toLocaleString() || 0}`,
      change: `${financeStats.outstanding_invoices || 0} invoices`,
      changeType: "neutral" as const,
      icon: Clock,
      description: "Outstanding",
    },
    {
      title: "Overdue Payments",
      value: `KES ${financeStats.overdue_payments?.toLocaleString() || 0}`,
      change: `${financeStats.overdue_invoices || 0} invoices`,
      changeType: financeStats.overdue_invoices > 0 ? "negative" : "neutral" as const,
      icon: AlertTriangle,
      description: "Past due",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {stat.value}
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span
                  className={`font-medium ${
                    stat.changeType === "positive"
                      ? "text-secondary"
                      : stat.changeType === "negative"
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }`}
                >
                  {stat.change}
                </span>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
