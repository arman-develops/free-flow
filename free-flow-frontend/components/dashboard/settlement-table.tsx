"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  CheckSquare,
  Loader2,
  User,
  Wallet,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { statsApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { RecordSettlementDialog } from "./record-settlement-dialog"
import { useState } from "react"

export default function SettlementsTable() {
    const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false)
    const {
        data: settlementTableResponse,
        isLoading,
        error
    } = useQuery({
        queryKey: ["settlements_table"],
        queryFn: statsApi.getRecentSettlements
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

    const settlements = settlementTableResponse?.success ? settlementTableResponse.data : []
    if (!settlements || settlements.length < 0) {
        return (
            <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Wallet className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No settlements found
                </h3>
                <p className="text-gray-500 max-w-md mb-4">
                You haven’t recorded any settlements yet. Once associates complete
                their tasks and payouts are processed, they’ll appear here with details
                on amounts, status, and dates.
                </p>
                <Button variant="outline" className="mt-2">
                Record a Settlement
                </Button>
            </CardContent>
            </Card>
        )
    }    

    const formatCurrency = (amount: number, currency: string) => {
        return `${currency} ${amount?.toLocaleString()}`
    }
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

    return (
        <>
            <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="border-gray-100">
                <CardTitle className="text-lg font-medium text-gray-900">
                Pending Settlements
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
                <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                    <TableHead>Associate</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Cut</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {settlements?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                            No pending settlements found.
                            </TableCell>
                        </TableRow>
                        ) : (
                        settlements.map((associate: any) =>
                            associate.projects.map((project: any) =>
                                project.tasks.map((task: any) => (
                                    <TableRow key={task.task_id} className="hover:bg-gray-50">
                                    <TableCell className="text-sm font-medium text-gray-800">
                                        {associate.associate_name}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {project.project_name}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-700">
                                        {task.task_title}
                                    </TableCell>
                                    <TableCell className="text-sm font-semibold">
                                        {formatCurrency(task.expected_amount, "KES")}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {task.percentage_cut}%
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                        variant="outline"
                                        className={`text-xs capitalize ${
                                            task.status === "pending"
                                            ? "text-amber-600 border-amber-200 bg-amber-50"
                                            : "text-green-700 border-green-200 bg-green-50"
                                        }`}
                                        >
                                        {task.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-500">
                                        {new Date(task.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-sm"
                                            disabled={task.status !== "pending"}
                                            onClick={() => setIsRecordDialogOpen(true)}
                                        >
                                        Settle Payment
                                        </Button>
                                    </TableCell>
                                    </TableRow>
                                ))
                            )
                        )
                    )}
                </TableBody>
                </Table>
            </CardContent>
            {/* Record Settlement Dialog */}
            <RecordSettlementDialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen} />
            </Card>
        </>
    )
}