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
} from "lucide-react";

const payments = [
  {
    id: 1,
    invoice: "INV-001",
    client: "TechCorp Inc.",
    project: "Website Redesign",
    amount: 3500,
    status: "paid",
    method: "project",
    dueDate: "2024-12-10",
    paidDate: "2024-12-08",
  },
  {
    id: 2,
    invoice: "INV-002",
    client: "StartupXYZ",
    project: "Mobile App Development",
    amount: 2250,
    status: "pending",
    method: "task",
    dueDate: "2024-12-15",
    paidDate: null,
  },
  {
    id: 3,
    invoice: "INV-003",
    client: "RetailCorp",
    project: "E-commerce Platform",
    amount: 4000,
    status: "overdue",
    method: "project",
    dueDate: "2024-12-05",
    paidDate: null,
  },
  {
    id: 4,
    invoice: "INV-004",
    client: "Creative Agency",
    project: "Portfolio Website",
    amount: 1750,
    status: "paid",
    method: "project",
    dueDate: "2024-12-12",
    paidDate: "2024-12-11",
  },
  {
    id: 5,
    invoice: "INV-005",
    client: "Global Solutions",
    project: "Brand Identity",
    amount: 1200,
    status: "pending",
    method: "task",
    dueDate: "2024-12-20",
    paidDate: null,
  },
];

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

export function PaymentsTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Payments</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(payment.status)}
                    <div>
                      <div className="font-medium">{payment.invoice}</div>
                      <Badge variant="outline" className="text-xs">
                        {payment.method}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-sm">{payment.client}</div>
                    <div className="text-xs text-muted-foreground">
                      {payment.project}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    ${payment.amount.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>Due: {payment.dueDate}</div>
                    {payment.paidDate && (
                      <div className="text-xs text-muted-foreground">
                        Paid: {payment.paidDate}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Payment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
