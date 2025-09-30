"use client"

import { 
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Search,
  Loader2,
  CheckSquare,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { invoiceApi } from "@/lib/api";
import { DetailPanel } from "./details-panel";

interface Invoice {
    id: string
    invoice_number: string
    amount: number
    currency: string
    status: string
    issue_date: string
    due_date: string
    paid_date: string
    payment_method: string
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "paid":
      return <CheckCircle className="h-4 w-4 text-secondary" />;
    case "pending":
      return <Clock className="h-4 w-4 text-primary" />;
    case "overdue":
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <Badge variant="secondary">Paid</Badge>;
    case "pending":
      return <Badge variant="default">Pending</Badge>;
    case "overdue":
      return <Badge variant="destructive">Overdue</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export function InvoicesTable() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isInvoiceDetailOpen, setInvoiceDetailOpen] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

    const handleInvoiceClick = (invoice:any) => {
        setSelectedInvoice(invoice)
        setInvoiceDetailOpen(true)
    }

    const {
        data: invoicesResponse,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["invoices"],
        queryFn: invoiceApi.getInvoicesByUser
    })

    if (isLoading) {
        <Card>
            <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading invoices...</span>
            </div>
            </CardContent>
      </Card>
    }

    if (error) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                    <p className="text-red-600">Failed to load invoices</p>
                    <p className="text-sm text-muted-foreground">Please try again later</p>
                </div>
                </CardContent>
            </Card>
        )
    }

    const invoices = invoicesResponse?.data || []
    
    if(invoices?.length === 0) {
        return (
        <>
            <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckSquare className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No invoices yet</h3>
                <p className="text-gray-500 text-center mb-4">Create your first invoice to get started with this project.</p>
            </CardContent>
            </Card>
        </>
        )
    }

    console.log(invoices)
    
    const filteredInvoices = invoices?.filter((invoice: Invoice) =>
        invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.payment_method?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <Card>
            <CardHeader className="flex items-center justify-between">
                <CardTitle>All Invoices</CardTitle>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search invoices..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-64"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Amount</TableHead>
                    {/* <TableHead>Currency</TableHead> */}
                    <TableHead>Status</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredInvoices.map((invoice:Invoice) => (
                        <TableRow key={invoice.id} className="cursor-pointer transition-shadow" onClick={() => handleInvoiceClick(invoice)}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(invoice.status)}
                                    <div>
                                        <div className="font-medium">{invoice.invoice_number}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-medium text-sm">{invoice.amount}</div>
                                    <div className="text-xs text-muted-foreground">
                                    {invoice.currency}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                            <TableCell>
                                <div className="text-sm">
                                    <div>
                                        {
                                            new Date(invoice.issue_date).toLocaleDateString()
                                        }
                                        </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="text-sm">
                                    <div>Due: 
                                        {
                                            new Date(invoice.due_date).toLocaleDateString()
                                        }
                                    </div>
                                    {invoice.paid_date && (
                                    <div className="text-xs text-muted-foreground">
                                        Paid: 
                                        {
                                            new Date(invoice.paid_date).toLocaleDateString()
                                        }
                                    </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="text-sm">
                                    {invoice.payment_method}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
            {/* DetailPanel for invoice details */}
            <DetailPanel
                isOpen={isInvoiceDetailOpen}
                onClose={() => setInvoiceDetailOpen(false)}
                type="invoice"
                data={selectedInvoice}
            />
        </Card>
    )
}