"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { statsApi } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { Calendar, Clock, Loader2 } from "lucide-react"

const settlementHistory = [
  { month: "Jan 2025", amount: 28000, count: 8 },
  { month: "Dec 2024", amount: 32000, count: 10 },
  { month: "Nov 2024", amount: 25000, count: 7 },
  { month: "Oct 2024", amount: 29000, count: 9 },
  { month: "Sep 2024", amount: 31000, count: 11 },
  { month: "Aug 2024", amount: 27000, count: 8 },
]

export default function SettlementHistory() {
    const {
        data: settlementHistoryResponse,
        isLoading,
        error
    } = useQuery({
        queryKey: ["settlements_history"],
        queryFn: statsApi.getSettlementHistory
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

    const settlementHistory = settlementHistoryResponse?.success ? settlementHistoryResponse.data : []
    if (!settlementHistory || settlementHistory.length < 0) {
        return (
            <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Settlement History Yet
                </h3>
                <p className="text-gray-500 text-center mb-4 max-w-md">
                You haven’t recorded any settlements for your associates yet. 
                Once payments start coming in, you’ll see them summarized here.
                </p>
            </CardContent>
            </Card>
        );
    }
    console.log(settlementHistory)    
    
    return (
        <>
            {/* Settlement History */}
            <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-medium text-gray-900">Settlement History</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                <div className="space-y-4">
                    {settlementHistory?.map((item:any, index:any) => (
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
        </>
    )
}