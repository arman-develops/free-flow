"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { statsApi } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
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
  Loader2,
} from "lucide-react"

export default function SettlementStats() {
    const {
        data: settlementStatsResponse,
        isLoading,
        error
    } = useQuery({
        queryKey: ["settlements_stats"],
        queryFn: statsApi.getSettlementStats
    })

    const settlementStats = settlementStatsResponse?.success ? settlementStatsResponse.data : {}

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

    return (
        <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Payable</CardTitle>
                    <DollarSign className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                    KES {settlementStats.total_payable.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">{settlementStats.monthly_payable_change}</span> from last month
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
                    KES {settlementStats.total_settled_this_month.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                    {settlementStats.monthly_payable_of_total}% of total
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
                    KES {settlementStats.outstanding_balance.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="text-orange-600">{settlementStats.pending_settlements} pending</span> settlements
                    </p>
                </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Avg. Settlement Time</CardTitle>
                    <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{settlementStats.average_settlement_time} days</div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <ArrowDownRight className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">{settlementStats.settlement_time_improvement}</span> improvement
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
                        <p className="text-3xl font-bold text-gray-900 mt-1">{settlementStats.active_associates}</p>
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
                        <p className="text-3xl font-bold text-gray-900 mt-1">{settlementStats.payment_success_rate}%</p>
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
                        <p className="text-3xl font-bold text-gray-900 mt-1">{settlementStats.total_transactions}</p>
                    </div>
                    <Wallet className="h-10 w-10 text-purple-600 opacity-20" />
                    </div>
                </CardContent>
                </Card>
            </div>
        </>
    )
}