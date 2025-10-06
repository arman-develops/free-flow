"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { paymentApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { DetailPanel } from "./details-panel";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "confirmed":
      return <CheckCircle className="h-4 w-4 text-secondary" />;
    case "pending":
      return <Clock className="h-4 w-4 text-primary" />;
    case "failed":
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Badge variant="secondary">Confirmed</Badge>;
    case "pending":
      return <Badge variant="default">Pending</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export function PaymentsTable() {
  const [allPaymentsBtnDisabled, setAllPaymentsBtnDisabled] = useState(false)
  const [isPaymentsPanelOpen, setIsPaymentsPanelOpen] = useState(false)
  const [allPaymentsData, setAllPaymentsData] = useState(null)

  const handleAllPaymentsClick = (data:any) => {
    setIsPaymentsPanelOpen(true)
    setAllPaymentsData(data)
  } 

  const {data: paymentsResponse, isLoading, error} = useQuery({
    queryKey: ["payments_by_invoice"],
    queryFn: paymentApi.getPayments,
  })

  const allPayments = paymentsResponse?.success ? paymentsResponse.data : []
  const recentPayments = allPayments?.length > 0 ? allPayments
    ?.filter((payment: any) => payment.paid_date)
    ?.sort(
      (a: any, b: any) =>
        new Date(b.paid_date).getTime() - new Date(a.paid_date).getTime()
    )
    .slice(0, 5) : []

  useEffect(() => {
    setAllPaymentsBtnDisabled(recentPayments.length === 0);
  }, [recentPayments]);

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Payments</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary" 
          onClick={() => handleAllPaymentsClick(allPayments)}
          disabled={allPaymentsBtnDisabled}
        >
          View All
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        {recentPayments && recentPayments.length > 0 ? (
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead className="w-[50px]">Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPayments.map((payment:any) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <div>
                        <div className="font-medium">{payment.invoice_number}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {payment.currency} {payment.amount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                        <div className="text-xs text-muted-foreground">
                          Paid: {
                            new Date(payment.paid_date).toLocaleDateString()
                          }
                        </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {payment.method}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ): (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <p className="text-sm font-medium mb-1">No recent payments</p>
            <p className="text-xs">Your latest recorded payments will appear here.</p>
          </div>
        )}
      </CardContent>
      <DetailPanel
          isOpen={isPaymentsPanelOpen}
          onClose={() => setIsPaymentsPanelOpen(false)}
          type="payments"
          data={allPaymentsData}
      />
    </Card>
  );
}
