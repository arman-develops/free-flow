"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,650",
    change: "+15.2%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "This year",
  },
  {
    title: "Monthly Revenue",
    value: "$12,450",
    change: "+8.3%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "This month",
  },
  {
    title: "Total Expenses",
    value: "$14,320",
    change: "+5.1%",
    changeType: "negative" as const,
    icon: TrendingDown,
    description: "This year",
  },
  {
    title: "Net Profit",
    value: "$31,330",
    change: "+18.7%",
    changeType: "positive" as const,
    icon: CheckCircle,
    description: "This year",
  },
  {
    title: "Pending Payments",
    value: "$8,750",
    change: "3 invoices",
    changeType: "neutral" as const,
    icon: Clock,
    description: "Outstanding",
  },
  {
    title: "Overdue Payments",
    value: "$2,300",
    change: "2 invoices",
    changeType: "negative" as const,
    icon: AlertTriangle,
    description: "Past due",
  },
];

export function FinanceStats() {
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
