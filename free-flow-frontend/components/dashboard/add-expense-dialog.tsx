"use client"

import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Receipt, Plus, Upload } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { expensesApi } from "@/lib/api"
import { queryClient } from "@/lib/query-client"

interface AddExpenseDialogProps {
  trigger?: React.ReactNode
  data: any
}

export function AddExpenseDialog({ trigger, data }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false)
  const [expenseDate, setExpenseDate] = useState<Date>()
  const [formData, setFormData] = useState({
    project_id: data.id as string,
    amount: "",
    currency: "USD",
    description: "",
    category: "",
    vendor: "",
    receiptURL: "",
  })

  const createExpenseMutation = useMutation({
    mutationFn: expensesApi.create,
    onSuccess: () => {
      toast.success("Expenses added successfully!")
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create client")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!expenseDate) {
      toast.error("Please select an expense date")
      return
    }

    try {
      const expenseData = {
        ...formData,
        amount: Number.parseFloat(formData.amount),
        date: expenseDate.toISOString(),
      }

      createExpenseMutation.mutate(expenseData)
      toast.success("Expense added successfully!")
      setOpen(false)

      // Reset form
      setFormData({
        project_id: "",
        amount: "",
        currency: "USD",
        description: "",
        category: "",
        vendor: "",
        receiptURL: "",
      })
      setExpenseDate(undefined)
    } catch (error) {
      toast.error("Failed to add expense")
      console.error("Add expense error:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full bg-transparent mb-3">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Add New Expense
          </DialogTitle>
          <DialogDescription>
            Record a new business expense. Upload receipts and categorize for better tracking.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectId">Project *</Label>
              <div>{data.name}</div>
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="hosting">Hosting</SelectItem>
                  <SelectItem value="assets">Assets</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="outsourcing">Outsourcing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="KES">KES</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Expense Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !expenseDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expenseDate ? format(expenseDate, "PPP") : "Select expense date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={expenseDate} onSelect={setExpenseDate} />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the expense"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="vendor">Vendor</Label>
            <Input
              id="vendor"
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              placeholder="Company or person paid"
            />
          </div>

          <div>
            <Label htmlFor="receiptURL">Receipt URL</Label>
            <div className="flex gap-2">
              <Input
                id="receiptURL"
                value={formData.receiptURL}
                onChange={(e) => setFormData({ ...formData, receiptURL: e.target.value })}
                placeholder="https://example.com/receipt.pdf"
              />
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Upload receipt image or PDF for record keeping</p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Expense</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
