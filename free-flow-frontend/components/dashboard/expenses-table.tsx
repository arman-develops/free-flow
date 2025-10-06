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
import { MoreHorizontal, Eye, Edit, Trash2, ArrowRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { expensesApi } from "@/lib/api"
import { useEffect, useState } from "react";
import { DetailPanel } from "./details-panel";

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

export function ExpensesTable() {

  const [isExpensesPanelOpen, setIsExpensesPanelOpen] = useState(false)
  const [allExpensesData, setAllExpensesData] = useState(null)
  const [allExpensesBtnDisabled, setAllExpensesBtnDisabled] = useState(false)

  const handleAllExpensesClick = (data:any) => {
    setIsExpensesPanelOpen(true)
    setAllExpensesData(data)
  } 

  const {
    data: expenseDataResponse,
    isLoading,
    error
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: expensesApi.getExpensesByUser
  })

  const allExpenses = expenseDataResponse?.success ? expenseDataResponse.data : []
  const recentExpenses =
    allExpenses?.length > 0
      ? allExpenses
          .filter((expense: any) => expense.date)
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()) // ✅ fix: return the difference
          .slice(0, 5)
      : [];

  useEffect(() => {
    setAllExpensesBtnDisabled(recentExpenses.length === 0);
  }, [recentExpenses]);

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
        <CardTitle>Recent Expenses</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary"
          onClick={() => handleAllExpensesClick(allExpenses)}
          disabled={allExpensesBtnDisabled}
        >
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
      <DetailPanel
        isOpen={isExpensesPanelOpen}
        onClose={() => setIsExpensesPanelOpen(false)}
        type="expenses"
        data={allExpensesData}
      />
    </Card>
  );
}
