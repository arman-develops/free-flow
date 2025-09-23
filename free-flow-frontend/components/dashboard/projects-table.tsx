"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash2, Eye, Calendar, DollarSign, User } from "lucide-react"

const projects = [
  {
    id: 1,
    name: "TechCorp Website Redesign",
    client: "TechCorp Inc.",
    status: "in-progress",
    progress: 75,
    budget: 8500,
    spent: 6375,
    startDate: "2024-11-01",
    dueDate: "2024-12-20",
    assignedTo: "Sarah Johnson",
    tasks: 12,
    completedTasks: 9,
  },
  {
    id: 2,
    name: "StartupXYZ Mobile App",
    client: "StartupXYZ",
    status: "in-progress",
    progress: 45,
    budget: 15000,
    spent: 6750,
    startDate: "2024-10-15",
    dueDate: "2025-01-15",
    assignedTo: "Mike Chen",
    tasks: 20,
    completedTasks: 9,
  },
  {
    id: 3,
    name: "E-commerce Platform",
    client: "RetailCorp",
    status: "at-risk",
    progress: 30,
    budget: 12000,
    spent: 4200,
    startDate: "2024-11-15",
    dueDate: "2024-12-30",
    assignedTo: "John Doe",
    tasks: 15,
    completedTasks: 4,
  },
  {
    id: 4,
    name: "Portfolio Website",
    client: "Creative Agency",
    status: "completed",
    progress: 100,
    budget: 3500,
    spent: 3150,
    startDate: "2024-11-20",
    dueDate: "2024-12-18",
    assignedTo: "You",
    tasks: 8,
    completedTasks: 8,
  },
  {
    id: 5,
    name: "Brand Identity Design",
    client: "Global Solutions",
    status: "planning",
    progress: 5,
    budget: 5000,
    spent: 0,
    startDate: "2024-12-15",
    dueDate: "2025-01-30",
    assignedTo: "Sarah Johnson",
    tasks: 6,
    completedTasks: 0,
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge variant="secondary">Completed</Badge>
    case "in-progress":
      return <Badge variant="default">In Progress</Badge>
    case "at-risk":
      return <Badge variant="destructive">At Risk</Badge>
    case "planning":
      return <Badge variant="outline">Planning</Badge>
    case "on-hold":
      return <Badge variant="outline">On Hold</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export function ProjectsTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Projects</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
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
              <TableHead>Project</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {project.completedTasks}/{project.tasks} tasks completed
                    </div>
                  </div>
                </TableCell>
                <TableCell>{project.client}</TableCell>
                <TableCell>{getStatusBadge(project.status)}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2 w-20" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="h-3 w-3" />${project.spent.toLocaleString()} / $
                      {project.budget.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((project.spent / project.budget) * 100)}% spent
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {project.dueDate}
                    </div>
                    <div className="text-xs text-muted-foreground">Started: {project.startDate}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <User className="h-3 w-3" />
                    {project.assignedTo}
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
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Project
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
