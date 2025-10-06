"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  X,
  Edit3,
  Save,
  Share2,
  CheckCircle2,
  DollarSign,
  Mail,
  Phone,
  Building2,
  FolderOpen,
  ListTodo,
  Calendar,
  User,
  ExternalLink,
  UserCheck,
  Star,
  Percent,
  FileText,
  CreditCard,
  Clock,
  AlertCircle,
  Wallet,
  Receipt,
  Users,
} from "lucide-react"
import { paymentApi, projectsApi, tasksApi } from "@/lib/api"
import { useUpdateProject } from "@/hooks/use-projects"
import { useUpdateTask } from "@/hooks/use-tasks"
import { useUpdateAssociate } from "@/hooks/use-associates"
import { toast } from "sonner"
import { useAssociates } from "@/hooks/use-associates"
import { AddExpenseDialog } from "./add-expense-dialog"
import { CreateInvoiceDialog } from "./create-invoice-dialog"
import { AddPaymentDialog } from "./add-payment-dialog"
import { queryClient } from "@/lib/query-client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DetailPanelProps {
  isOpen: boolean
  onClose: () => void
  type: "client" | "project" | "task" | "associate" | "invoice" | "payments" | "clients" | "expenses" | null
  data: any
  client?: any
}

export function DetailPanel({ isOpen, onClose, type, data, client }: DetailPanelProps) {

  useEffect(() => {
    setEditData(data)
    setNotes(data?.notes || "")
  }, [data])

  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(data)
  const [notes, setNotes] = useState("")

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: [`projects`, data?.id],
    queryFn: () => projectsApi.getProjectByClientID(data.id),
    enabled: type === "client" && !!data?.id,
  })

  const { data: projectResponse, isLoading: projectLoading} = useQuery({
    queryKey: ["project", data?.id],
    queryFn: () => projectsApi.getProjectByID(data.id),
    enabled: type === "project" && !!data?.id,
  })

  const { data: associateTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["taskByAssociate", data?.id],
    queryFn: () => tasksApi.getTasksByAssociateID(data.id),
    enabled: type === "associate" && !!data?.id,
  })

  const {data: paymentsResponse, isLoading: paymentsLoading} = useQuery({
    queryKey: ["payments_by_invoice"],
    queryFn: paymentApi.getPayments,
    enabled: type === "invoice" && !!data?.id,
  })

  const updateProject = useUpdateProject()
  const updateTask = useUpdateTask()
  const updateAssociate = useUpdateAssociate()
  const { data: associatesResponse } = useAssociates()
  const associates = associatesResponse?.success ? associatesResponse.data : []
  const tasks = associateTasks?.success ? associateTasks.data : []

  const allPayments = paymentsResponse?.success ? paymentsResponse?.data : []
  const project = projectResponse?.success ? projectResponse.data : {}
  const projectDetails = project ?? data

  if (!isOpen || !type || !data) return null

  const handleSave = async () => {
    try {
      if (type === "project") {
        await updateProject.mutateAsync({ id: data.id, data: editData })
        toast.success("Project updated successfully")
        queryClient.invalidateQueries({queryKey: ["projects"]}) // for sidebar list + aggregations
        queryClient.invalidateQueries({queryKey: ["project", data.id]}) // for sidepanel
      } else if (type === "task") {
        await updateTask.mutateAsync({ id: data.id, data: editData })
        toast.success("Task updated successfully")
      } else if (type === "associate") {
        await updateAssociate.mutateAsync({ id: data.id, data: editData })
        toast.success("Associate updated successfully")
      }
      setIsEditing(false)
    } catch (error) {
      toast.error("Failed to save changes")
      console.error("Save error:", error)
    }
  }

  const handleMarkComplete = () => {
    // TODO: Implement mark complete functionality
    console.log("Marking complete:", data)
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Sharing:", data)
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}`)
    onClose() // Close the detail panel when navigating
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      case "urgent":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

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

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`
  }

  const isOverdue = (dueDate: string, status: string) => {
    if (status === "paid" || status === "cancelled") return false
    return new Date(dueDate) < new Date()
  }

  const renderClientDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Building2 className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{data.companyName}</h3>
          <p className="text-sm text-gray-500">Client</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{data.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{data.contact}</span>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">Created {new Date(data.CreatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Projects</h4>
        {projectsLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : projects?.data?.length ? (
          <div className="space-y-2">
            {projects.data.map((project: any) => (
              <div
                key={project.id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm group-hover:text-blue-600">{project.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">${project.estimated_value}</Badge>
                    <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{project.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No projects yet</p>
        )}
      </div>
    </div>
  )

  const renderAllPayments = () => (
    <div className="space-y-3 pt-4 border-gray-200">
      <div className="flex items-center gap-2">
        <Wallet className="h-4 w-4 text-gray-700" />
        <h4 className="font-medium text-gray-900">All Payments</h4>
      </div>
      <div className="space-y-2">
        {data.length > 0 ? (
          data.map((payment: any) => (
            <div
              key={payment.id}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
            >
              {/* Top Row: Method + Amount + Status */}
              <div className="flex items-center justify-between">
                {/* Payment Method */}
                <span className="font-medium text-sm group-hover:text-blue-600 capitalize">
                  {payment.method}
                </span>

                <div className="flex items-center gap-2">
                  {/* Amount */}
                  <Badge variant="outline" className="text-xs">
                    {formatCurrency(payment.amount, payment.currency)}
                  </Badge>

                  {/* Status */}
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      payment.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : payment.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>

              {/* Middle: Invoice + Date + Ref */}
              <p className="text-xs text-gray-600 mt-1 font-mono">
                Invoice: {payment.invoice_number}
              </p>
              <p className="text-xs text-gray-500">
                Paid on {new Date(payment.paid_date).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Ref: {payment.transaction_ref}</p>

              {/* Optional Notes */}
              {payment.notes && (
                <p className="text-xs text-gray-400 mt-1 italic">{payment.notes}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic">No payments found for this invoice.</p>
        )}
      </div>
    </div>
  )

  const renderAllExpenses = () => (
    <div className="space-y-3 pt-4 border-gray-200">
      <div className="flex items-center gap-2">
        <Receipt className="h-4 w-4 text-gray-700" />
        <h4 className="font-medium text-gray-900">All Expenses</h4>
      </div>
      <div className="space-y-3">
      {data.length > 0 ? (
        data.map((expense: any) => (
          <div
            key={expense.id}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Top row: Project & Amount */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {expense.project_name}
                </h3>
                <p className="text-xs text-gray-500">
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">
                  {formatCurrency(expense.amount, expense.currency)}
                </p>
                <Badge
                  variant="outline"
                  className={`text-xs mt-1 ${getCategoryBadge(expense.category)}`}
                >
                  {expense.category}
                </Badge>
              </div>
            </div>

            {/* Middle row: Description */}
            {expense.description && (
              <p className="text-xs text-gray-600 mt-2">{expense.description}</p>
            )}

            {/* Bottom row: Vendor */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span className="italic">
                Vendor:{" "}
                <span className="not-italic font-medium text-gray-700">
                  {expense.vendor || "N/A"}
                </span>
              </span>
              <span className="font-mono text-gray-400">
                Ref: {expense.id.slice(0, 8)}...
              </span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400 italic">No expenses recorded yet.</p>
      )}
    </div>
    </div>
  )

  const renderAllClients = () => (
    <div className="space-y-3 pt-4 border-gray-200">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-gray-700" />
        <h4 className="font-medium text-gray-900">All Clients</h4>
      </div>
        <div className="space-y-2">
          {data.map((client: any) => (
            <div
              key={client.id}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{client.companyName}</p>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Phone className="h-3 w-3" />
                      {client.contact}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Mail className="h-3 w-3" />
                      {client.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

    </div>
  )

  const renderEnhancedProjectDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <FolderOpen className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{projectDetails?.name}</h3>
          <p className="text-sm text-gray-500">Project for {client?.companyName}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Status</Label>
            {isEditing ? (
              <Select
                value={editData?.status || "active"}
                onValueChange={(value) => setEditData({ ...editData, status: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inquiry">Inquiry</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className="mt-1">
                {projectDetails?.status || "proposal"}
              </Badge>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Priority</Label>
            {isEditing ? (
              <Select
                value={editData.priority || "medium"}
                onValueChange={(value) => setEditData({ ...editData, priority: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className={`mt-1 ${getPriorityColor(projectDetails?.priority || "medium")}`}>
                {projectDetails?.priority || "medium"}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Current Phase</Label>
            {isEditing ? (
              <Select
                value={editData.current_phase || "discovery"}
                onValueChange={(value) => setEditData({ ...editData, current_phase: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discovery">Discovery</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className={`mt-1`}>
                {projectDetails?.current_phase || "discovery"}
              </Badge>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Progress</Label>
            <div className="mt-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${projectDetails?.progress_percent || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{projectDetails?.progress_percent || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Estimated Value</Label>
            {isEditing ? (
              <Input
                type="number"
                value={editData.estimated_value || ""}
                onChange={(e) => setEditData({ ...editData, estimated_value: Number.parseFloat(e.target.value) })}
                className="mt-1"
              />
            ) : (
              <div className="flex items-center gap-1 text-sm mt-1">
                <DollarSign className="h-3 w-3" />
                {projectDetails?.estimated_value ? `${projectDetails?.currency || "$"}${projectDetails?.estimated_value}` : "Not set"}
              </div>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Actual Value</Label>
            {isEditing ? (
              <Input
                type="number"
                value={editData.actual_value || ""}
                onChange={(e) => setEditData({ ...editData, actual_value: Number.parseFloat(e.target.value) })}
                className="mt-1"
              />
            ) : (
              <div className="flex items-center gap-1 text-sm mt-1">
                <DollarSign className="h-3 w-3" />
                {projectDetails?.actual_value ? `${projectDetails?.currency || "$"}${projectDetails?.actual_value}` : "Not set"}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Deadline</Label>
            {isEditing ? (
              <Input
                type="date"
                value={editData.deadline ? new Date(editData.deadline).toISOString().split("T")[0] : ""}
                onChange={(e) => {
                  const date = new Date(e.target.value)
                  setEditData({ ...editData, deadline: date.toISOString() })
                  console.log(date)
                }}
                className="mt-1"
              />
            ) : (
              <div className="flex items-center gap-1 text-sm mt-1">
                <Calendar className="h-3 w-3" />
                {projectDetails?.deadline ? new Date(projectDetails?.deadline).toLocaleDateString() : "Not set"}
              </div>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Your Cut (%)</Label>
            {isEditing ? (
              <Input
                type="number"
                min="0"
                max="100"
                value={editData.your_cut_percent || ""}
                onChange={(e) => setEditData({ ...editData, your_cut_percent: Number.parseInt(e.target.value) })}
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-gray-600 mt-1">{projectDetails?.your_cut_percent || 0}%</p>
            )}
          </div>

          <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-gray-900">
                Category *
              </Label>
              {
                isEditing ? ( 
                  <Select
                    value={editData.category}
                    onValueChange={(value) => setEditData({...editData, category: value})}
                    required
                  >
                    <SelectTrigger id="category" className="w-full border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Web Development</SelectItem>
                      <SelectItem value="mobile">Mobile Apps</SelectItem>
                      <SelectItem value="design">UI/UX Design</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline" className={`mt-1`}>
                    {projectDetails?.category || "Other"}
                  </Badge>
                )
              }
            </div>
        </div>

        {projectDetails?.completed_at && (
          <div>
            <Label className="text-sm font-medium">Completed At</Label>
            <div className="flex items-center gap-1 text-sm mt-1">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
              {new Date(projectDetails.completed_at).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Description</h4>
        {isEditing ? (
          <Textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="min-h-[100px]"
          />
        ) : (
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {projectDetails?.description || "No description provided"}
          </p>
        )}
      </div>

      <div>
        <AddExpenseDialog data={projectDetails} />
        <CreateInvoiceDialog data={projectDetails} />
      </div>

      <div className="pt-2">
        <Button onClick={() => handleProjectClick(data.id)} variant="outline" className="w-full">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Project Details & Tasks
        </Button>
      </div>
    </div>
  )

  const renderEnhancedTaskDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <ListTodo className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{data.title}</h3>
          <p className="text-sm text-gray-500">Task</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Status</Label>
            {isEditing ? (
              <Select
                value={editData.status || "todo"}
                onValueChange={(value) => setEditData({ ...editData, status: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant={data.status === "done" ? "default" : "secondary"} className="mt-1">
                {data.status || "todo"}
              </Badge>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Priority</Label>
            {isEditing ? (
              <Select
                value={editData.priority || "medium"}
                onValueChange={(value) => setEditData({ ...editData, priority: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className={`mt-1 ${getPriorityColor(data.priority || "medium")}`}>
                {data.priority || "medium"}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Estimated Hours</Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.5"
                value={editData.estimated_hours || ""}
                onChange={(e) => setEditData({ ...editData, estimated_hours: Number.parseFloat(e.target.value) })}
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-gray-600 mt-1">{data.estimated_hours || 0}h</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Actual Hours</Label>
            <p className="text-sm text-gray-600 mt-1">{data.actual_hours || 0}h</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Due Date</Label>
            {isEditing ? (
              <Input
                type="date"
                value={editData.due_date ? new Date(editData.due_date).toISOString().split("T")[0] : ""}
                onChange={(e) => {
                  const date = new Date(e.target.value)
                  setEditData({ ...editData, due_date: date.toISOString() }) // send full datetime
                }}
                className="mt-1"
              />
            ) : (
              <div className="flex items-center gap-1 text-sm mt-1">
                <Calendar className="h-3 w-3 text-gray-400" />
                {data.due_date ? new Date(data.due_date).toLocaleDateString() : "Not set"}
              </div>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Assigned Associate</Label>
            {isEditing ? (
              <Select
                value={editData.assigned_to_associate || "unassigned"}
                onValueChange={(value) =>
                  setEditData({ ...editData, assigned_to_associate: value === "unassigned" ? null : value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select associate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {associates.map((associate: any) => (
                    <SelectItem key={associate.id} value={associate.id}>
                      {associate.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-1 text-sm mt-1">
                <User className="h-3 w-3" />
                {data.assigned_to_associate
                  ? associates.find((a: any) => a.id === data.assigned_to_associate)?.name || "Unknown"
                  : "Unassigned"}
              </div>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Task Value</Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.5"
                value={editData.task_value || ""}
                onChange={(e) => setEditData({ ...editData, task_value: Number.parseFloat(e.target.value) })}
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-gray-600 mt-1">{data.task_value || 0} KES</p>
            )}
          </div>
        </div>

        {data.completed_at && (
          <div>
            <Label className="text-sm font-medium">Completed At</Label>
            <div className="flex items-center gap-1 text-sm mt-1">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
              {new Date(data.completed_at).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Description</h4>
        {isEditing ? (
          <Textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="min-h-[100px]"
          />
        ) : (
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {data.description || "No description provided"}
          </p>
        )}
      </div>
    </div>
  )

  const renderAssociateDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <UserCheck className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{data.name}</h3>
          <p className="text-sm text-gray-500">Associate</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Name</Label>
            <p className="text-sm text-gray-600 mt-1">{data.name}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Status</Label>
            <Badge variant="outline" className="mt-1 caret-emerald-400">
              {data.status || "active"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Email</Label>
            <div className="flex items-center gap-1 text-sm mt-1">
              <Mail className="h-3 w-3" />
              {data.email}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Phone</Label>
            <div className="flex items-center gap-1 text-sm mt-1">
              <Phone className="h-3 w-3" />
              {data.phone}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{data.rating || 4.5}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 mt-1">
              <Percent className="h-3 w-3" />
              <span className="font-medium">{data.rate || 70}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap gap-1 mt-1">
            <Label className="text-sm font-medium">Skills</Label>
            {(data.skills || []).map((skill: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Tasks</h4>
        {tasksLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : tasks.filter((task: any) => task.assigned_to_associate === data.id).length > 0 ? (
          <div className="space-y-2">
            {tasks
              .filter((task: any) => task.assigned_to_associate === data.id)
              .map((task: any) => (
                <div
                  key={task.id}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm group-hover:text-blue-600">{task.title}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">${task.task_value}</Badge>
                      <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No tasks yet</p>
        )}
      </div>
    </div>
  )

  const renderInvoiceDetails = () => {
    const overdue = isOverdue(data.due_date, data.status)
    const paymentsByInvoice = allPayments.filter((payment:any) => 
      payment.invoice_id === data?.id
    )

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${overdue ? "bg-red-100" : "bg-emerald-100"}`}>
            <FileText className={`h-5 w-5 ${overdue ? "text-red-600" : "text-emerald-600"}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{data.invoice_number}</h3>
            <p className="text-sm text-gray-500">Invoice</p>
          </div>
        </div>

        {overdue && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-800 font-medium">This invoice is overdue</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Badge variant="outline" className={`mt-1 ${getStatusColor(data.status)}`}>
                {data.status}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Amount</Label>
              <div className="flex items-center gap-1 text-lg font-semibold mt-1">
                <DollarSign className="h-4 w-4" />
                {formatCurrency(data.amount, data.currency)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Issue Date</Label>
              <div className="flex items-center gap-1 text-sm mt-1">
                <Calendar className="h-3 w-3 text-gray-400" />
                {new Date(data.issue_date).toLocaleDateString()}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Due Date</Label>
              <div className="flex items-center gap-1 text-sm mt-1">
                <Clock className={`h-3 w-3 ${overdue ? "text-red-600" : "text-gray-400"}`} />
                <span className={overdue ? "text-red-600 font-medium" : ""}>
                  {new Date(data.due_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {data.paid_date && (
            <div>
              <Label className="text-sm font-medium">Paid Date</Label>
              <div className="flex items-center gap-1 text-sm mt-1">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                <span className="text-green-600">{new Date(data.paid_date).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Payment Method</Label>
              <div className="flex items-center gap-1 text-sm mt-1">
                <CreditCard className="h-3 w-3 text-gray-400" />
                {data.payment_method ? (
                  <span className="capitalize">{data.payment_method}</span>
                ) : (
                  <span className="text-gray-400">Not specified</span>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Transaction Ref</Label>
              <p className="text-sm text-gray-600 mt-1 font-mono">{data.transaction_ref || "N/A"}</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Project ID</Label>
            <p className="text-sm text-gray-600 mt-1 font-mono break-all">{data.project_id}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Description</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {data.description || "No description provided"}
          </p>
        </div>

        {data.notes && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Notes</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{data.notes}</p>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Timeline</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Created</p>
                <p className="text-xs text-gray-500">{new Date(data.created_at).toLocaleString()}</p>
              </div>
            </div>
            {data.updated_at !== data.created_at && (
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-600 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-xs text-gray-500">{new Date(data.updated_at).toLocaleString()}</p>
                </div>
              </div>
            )}
            {data.paid_date && (
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Paid</p>
                  <p className="text-xs text-gray-500">{new Date(data.paid_date).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {paymentsLoading ? (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Payments</h4>
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : paymentsByInvoice.length > 0 ? (
          <div className="space-y-2">
            {paymentsByInvoice.map((payment: any) => (
              <div
                key={payment.id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
              >
                <div className="flex items-center justify-between">
                  {/* Payment Method */}
                  <span className="font-medium text-sm group-hover:text-blue-600 capitalize">
                    {payment.method}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Amount + Currency */}
                    <Badge variant="outline">
                      {payment.currency} {payment.amount.toLocaleString()}
                    </Badge>

                    {/* Status */}
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        payment.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : payment.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>

                {/* Date + Transaction Ref */}
                <p className="text-xs text-gray-500 mt-1">
                  Paid on {new Date(payment.paid_date).toLocaleString()} <br />
                  Ref: {payment.transaction_ref}
                </p>

                {/* Notes (if any) */}
                {payment.notes && (
                  <p className="text-xs text-gray-400 mt-1 italic">{payment.notes}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No payments yet</p>
        )}
        <AddPaymentDialog data={data}/>
      </div>
    )
  }

  const renderNotes = () => (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Notes</h4>
      {isEditing ? (
          <Textarea
            value={editData.notes}
            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
            className="min-h-[100px]"
          />
        ) : (
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {data?.notes || "No notes provided"}
          </p>
        )}
    </div>
  )

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Details</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="text-gray-600 hover:text-gray-900"
            disabled={
              updateProject.isPending || 
              updateTask.isPending || 
              updateAssociate.isPending || 
              type === "clients" ||
              type === "payments" ||
              type === "expenses" || 
              type === "invoice"
            }
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {type === "client" && renderClientDetails()}
        {type === "project" && renderEnhancedProjectDetails()}
        {type === "task" && renderEnhancedTaskDetails()}
        {type === "associate" && renderAssociateDetails()}
        {type === "invoice" && renderInvoiceDetails()}
        {type === "clients" && renderAllClients()}
        {type === "payments" && renderAllPayments()}
        {type === "expenses" && renderAllExpenses()}

        {["project", "payments", "invoice"].includes(type) && renderNotes()}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {isEditing && (
          <Button
            onClick={handleSave}
            className="w-full"
            disabled={updateProject.isPending || updateTask.isPending || updateAssociate.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {updateProject.isPending || updateTask.isPending || updateAssociate.isPending
              ? "Saving..."
              : "Save Changes"}
          </Button>
        )}

        {type === "task" && (
          <Button onClick={handleMarkComplete} variant="outline" className="w-full bg-transparent">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark Complete
          </Button>
        )}

        <Button 
          onClick={handleShare} 
          variant="outline" 
          className="w-full bg-transparent"
          disabled={!["project", "task", "invoice"].includes(type)}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  )
}
