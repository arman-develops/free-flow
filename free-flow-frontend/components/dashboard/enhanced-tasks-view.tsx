"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Clock,
  User,
  Calendar,
  CheckCircle2,
  Circle,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Target,
  UserPlus,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AssignAssociatesDialog } from "./assign-associate-dialog"
import { useQueries, useQuery } from "@tanstack/react-query"
import { associatesApi, contractApi } from "@/lib/api"
import ContractModal from "./contract-creator"
import { Contract, Contracts } from "@/types/contract"

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  estimated_hours: number
  actual_hours: number
  due_date?: string
  assigned_to_associate?: string
  milestone?: string
  project: {
    name: string
    description: string
  }
}

interface EnhancedTasksViewProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
  isLoading?: boolean
}

export function EnhancedTasksView({ tasks, onTaskClick, isLoading }: EnhancedTasksViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"list" | "board">("list")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>();
  const [selectedContract, setSelectedContract] = useState<Contract>();

  const handleAssignAssociate = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedTask(task)
    setIsAssignDialogOpen(true)
  }

  const openContract = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Fetch contract by task ID
  const contractQueries = useQueries({
    queries: tasks.map(task => ({
      queryKey: ['contract', task.id],
      queryFn: () => contractApi.contractByTaskID(task.id),
      enabled: !!task.id,
    })),
  });

  const {
    data: associateResponse,
    isLoading: associateLoading,
    error: associateError,
  } = useQuery({
    queryKey: ["associates"],
    queryFn: associatesApi.getAssociatesByUserID
  })

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          color: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle2,
          iconColor: "text-green-600",
        }
      case "in_progress":
        return {
          label: "In Progress",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: PlayCircle,
          iconColor: "text-blue-600",
        }
      case "on_hold":
        return {
          label: "On Hold",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: PauseCircle,
          iconColor: "text-yellow-600",
        }
      case "todo":
        return {
          label: "To Do",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: Circle,
          iconColor: "text-gray-600",
        }
      default:
        return {
          label: status,
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: Circle,
          iconColor: "text-gray-600",
        }
    }
  }

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          label: "High",
          color: "bg-red-100 text-red-800 border-red-200",
          dotColor: "bg-red-500",
        }
      case "medium":
        return {
          label: "Medium",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          dotColor: "bg-yellow-500",
        }
      case "low":
        return {
          label: "Low",
          color: "bg-green-100 text-green-800 border-green-200",
          dotColor: "bg-green-500",
        }
      default:
        return {
          label: priority,
          color: "bg-gray-100 text-gray-800 border-gray-200",
          dotColor: "bg-gray-500",
        }
    }
  }

  const filteredTasks = tasks?.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })
  const associates = associateResponse?.success ? associateResponse?.data : []

  const getProgressPercentage = (task: Task) => {
    if (task.status === "completed") return 100
    if (task.actual_hours === 0) return 0
    return Math.min(Math.round((task.actual_hours / task.estimated_hours) * 100), 100)
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && statusFilter !== "completed"
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks?.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No tasks found</h3>
              <p className="text-gray-500 text-center">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first task to get started"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks?.map((task, index) => {
            const statusConfig = getStatusConfig(task.status)
            const priorityConfig = getPriorityConfig(task.priority)
            const StatusIcon = statusConfig.icon
            const progress = getProgressPercentage(task)
            const overdue = isOverdue(task.due_date)
            const contractQuery = contractQueries[index];
            const hasContract = contractQuery.data?.success && contractQuery.data?.data;
            const contract = contractQuery.data?.data

            return (
              <Card
                key={task.id}
                className={cn(
                  "border hover:shadow-md transition-all cursor-pointer group",
                  overdue && "border-red-300 bg-red-50/30",
                )}
                onClick={() => onTaskClick(task)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className="mt-1">
                      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", statusConfig.color)}>
                        <StatusIcon className={cn("h-5 w-5", statusConfig.iconColor)} />
                      </div>
                    </div>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {task.title}
                            </h3>
                            {overdue && (
                              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Overdue
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => handleAssignAssociate(task, e)}>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Assign Associate
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={(e) => { 
                                e.stopPropagation()
                                openContract(task)
                              }
                            }>
                              <FileText className="h-4 w-4 mr-2" />
                              View Contract
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Task
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={(e) => e.stopPropagation()}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Progress Bar */}
                      {task.status !== "todo" && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">Progress</span>
                            <span className="text-xs font-medium text-gray-900">{progress}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full transition-all rounded-full",
                                task.status === "completed"
                                  ? "bg-green-500"
                                  : progress > 80
                                    ? "bg-blue-500"
                                    : "bg-blue-400",
                              )}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Meta Information */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                        <Badge className={priorityConfig.color}>
                          <span className={cn("h-1.5 w-1.5 rounded-full mr-1.5", priorityConfig.dotColor)} />
                          {priorityConfig.label}
                        </Badge>
                        {task.milestone && (
                          <Badge variant="outline" className="text-xs">
                            <Target className="h-3 w-3 mr-1" />
                            {task.milestone}
                          </Badge>
                        )}
                          {contractQuery.isLoading ? (
                            <Badge variant="outline">Checking...</Badge>
                          ) : hasContract ? (
                            <Badge 
                              className="bg-green-100 text-green-800 border-green-200" 
                              onClick={
                                (e) => {
                                  e.stopPropagation()
                                  openContract(task)
                                }        
                              }
                            >
                              <FileText />
                              Contract Available
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                              No Contract
                            </Badge>
                          )}
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>
                            {task.actual_hours || 0}h / {task.estimated_hours}h
                          </span>
                        </div>
                        {task.assigned_to_associate && (
                          <div className="flex items-center gap-1.5">
                            <User className="h-4 w-4" />
                            <span>{task.assigned_to_associate}</span>
                          </div>
                        )}
                        {task.due_date && (
                          <div className={cn("flex items-center gap-1.5", overdue && "text-red-600 font-medium")}>
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(task.due_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
        {selectedTask && (
          <AssignAssociatesDialog
            isOpen={isAssignDialogOpen}
            onClose={() => setIsAssignDialogOpen(false)}
            taskId={selectedTask.id}
            taskTitle={selectedTask.title}
            currentAssociateId={selectedTask.assigned_to_associate}
            associates={associates}
          />
        )}
        {selectedTask && (
          <ContractModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTask(null);
            }}
            taskId={selectedTask.id}
            contract_metadata={{
              project_name: selectedTask.project?.name || "",
              project_description: selectedTask.project?.description || "",
              task_name: selectedTask.title,
              task_description: selectedTask.description || "",
            }}
          />
        )}
    </div>
  )
}
