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
import { MoreHorizontal, Eye, Edit, Trash2, ArrowRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { expensesApi } from "@/lib/api";

const expenses = [
  {
    id: 1,
    description: "Adobe Creative Suite License",
    category: "Software",
    amount: 52.99,
    date: "2024-12-01",
    project: "General",
    receipt: true,
    status: "approved",
  },
  {
    id: 2,
    description: "Domain Registration - techcorp.com",
    category: "Hosting",
    amount: 12.99,
    date: "2024-12-03",
    project: "TechCorp Website",
    receipt: true,
    status: "approved",
  },
  {
    id: 3,
    description: "Stock Photos License",
    category: "Assets",
    amount: 29.99,
    date: "2024-12-05",
    project: "StartupXYZ App",
    receipt: true,
    status: "approved",
  },
  {
    id: 4,
    description: "Coffee Meeting with Client",
    category: "Business",
    amount: 15.5,
    date: "2024-12-08",
    project: "Portfolio Website",
    receipt: false,
    status: "pending",
  },
  {
    id: 5,
    description: "Cloud Storage Upgrade",
    category: "Software",
    amount: 9.99,
    date: "2024-12-10",
    project: "General",
    receipt: true,
    status: "approved",
  },
];

const getCategoryBadge = (category: string) => {
  switch (category) {
    case "software":
      return <Badge variant="default">Software</Badge>;
    case "hardware":
      return <Badge variant="secondary">Hardware</Badge>;
    case "other":
      return <Badge variant="outline">Assets</Badge>;
    case "outsourcing":
      return <Badge variant="outline">Business</Badge>;
    default:
      return <Badge variant="outline">{category}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return <Badge variant="secondary">Approved</Badge>;
    case "pending":
      return <Badge variant="default">Pending</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export function ExpensesTable() {

  const {
    data: expenseDataResponse,
    isLoading,
    error
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: expensesApi.getExpensesByUser
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

  const allExpenses = expenseDataResponse.success ? expenseDataResponse.data : []
  const recentExpenses = allExpenses?.length > 0 ? allExpenses
    .filter((expenses:any) => expenses.date)
    .sort(
      (a:any, b:any) => {
        new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    )
    .slice(0, 5) : []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Expenses</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        {recentExpenses && recentExpenses.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[50px]">Project</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentExpenses.map((expense: any) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{expense.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {expense.vendor}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryBadge(expense.category)}</TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {expense.currency} {expense.amount.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="font-medium">{expense?.project_name}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <p className="text-sm font-medium mb-1">No recent expenses</p>
            <p className="text-xs">Your latest recorded expenses will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
