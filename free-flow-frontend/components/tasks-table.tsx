"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Edit, Trash2, Eye, Calendar, User, Clock, DollarSign } from "lucide-react"

const tasks = [
  {
    id: 1,
    title: "Complete API documentation",
    project: "TechCorp Website",
    client: "TechCorp Inc.",
    assignee: "Sarah Johnson",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-12-15",
    estimatedHours: 8,
    actualHours: 6,
    paymentType: "task",
    rate: 75,
    description: "Document all API endpoints and create usage examples",
  },
  {
    id: 2,
    title: "Review mobile app wireframes",
    project: "StartupXYZ App",
    client: "StartupXYZ",
    assignee: "Mike Chen",
    status: "pending",
    priority: "high",
    dueDate: "2024-12-16",
    estimatedHours: 4,
    actualHours: 0,
    paymentType: "project",
    rate: 0,
    description: "Review and provide feedback on mobile app wireframes",
  },
  {
    id: 3,
    title: "Database performance optimization",
    project: "E-commerce Platform",
    client: "RetailCorp",
    assignee: "John Doe",
    status: "in-progress",
    priority: "medium",
    dueDate: "2024-12-18",
    estimatedHours: 12,
    actualHours: 8,
    paymentType: "task",
    rate: 85,
    description: "Optimize database queries and improve performance",
  },
  {
    id: 4,
    title: "Client presentation preparation",
    project: "Portfolio Website",
    client: "Creative Agency",
    assignee: "You",
    status: "completed",
    priority: "high",
    dueDate: "2024-12-14",
    estimatedHours: 3,
    actualHours: 2.5,
    paymentType: "project",
    rate: 0,
    description: "Prepare presentation materials for client review",
  },
  {
    id: 5,
    title: "Logo design concepts",
    project: "Brand Identity Design",
    client: "Global Solutions",
    assignee: "Sarah Johnson",
    status: "not-started",
    priority: "medium",
    dueDate: "2024-12-20",
    estimatedHours: 6,
    actualHours: 0,
    paymentType: "task",
    rate: 65,
    description: "Create initial logo design concepts for review",
  },
  {
    id: 6,
    title: "User authentication implementation",
    project: "StartupXYZ App",
    client: "StartupXYZ",
    assignee: "Mike Chen",
    status: "overdue",
    priority: "high",
    dueDate: "2024-12-10",
    estimatedHours: 10,
    actualHours: 12,
    paymentType: "task",
    rate: 80,
    description: "Implement secure user authentication system",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge variant="secondary">Completed</Badge>
    case "in-progress":
      return <Badge variant="default">In Progress</Badge>
    case "pending":
      return <Badge variant="outline">Pending</Badge>
    case "not-started":
      return <Badge variant="outline">Not Started</Badge>
    case "overdue":
      return <Badge variant="destructive">Overdue</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">High</Badge>
    case "medium":
      return <Badge variant="default">Medium</Badge>
    case "low":
      return <Badge variant="secondary">Low</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export function TasksTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Tasks</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-xs">{task.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-sm">{task.project}</div>
                    <div className="text-xs text-muted-foreground">{task.client}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <User className="h-3 w-3" />
                    {task.assignee}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(task.status)}</TableCell>
                <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {task.dueDate}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />
                      {task.actualHours}h / {task.estimatedHours}h
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {task.actualHours > task.estimatedHours ? "Over" : "Under"} estimate
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs">
                      {task.paymentType}
                    </Badge>
                    {task.paymentType === "task" && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <DollarSign className="h-3 w-3" />${task.rate}/hr
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
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Task
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Task
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
