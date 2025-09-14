"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, ArrowRight } from "lucide-react"

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
]

const getCategoryBadge = (category: string) => {
  switch (category) {
    case "Software":
      return <Badge variant="default">Software</Badge>
    case "Hosting":
      return <Badge variant="secondary">Hosting</Badge>
    case "Assets":
      return <Badge variant="outline">Assets</Badge>
    case "Business":
      return <Badge variant="outline">Business</Badge>
    default:
      return <Badge variant="outline">{category}</Badge>
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return <Badge variant="secondary">Approved</Badge>
    case "pending":
      return <Badge variant="default">Pending</Badge>
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export function ExpensesTable() {
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-sm">{expense.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {expense.project} {expense.receipt && "• Receipt attached"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getCategoryBadge(expense.category)}</TableCell>
                <TableCell>
                  <div className="font-medium">${expense.amount.toFixed(2)}</div>
                </TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell>{getStatusBadge(expense.status)}</TableCell>
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
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Expense
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Expense
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
  )
}
