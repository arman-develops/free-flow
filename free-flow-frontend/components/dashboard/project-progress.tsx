"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FolderOpen, ArrowRight, Calendar, DollarSign } from "lucide-react"

const ongoingProjects = [
  {
    id: 1,
    name: "TechCorp Website Redesign",
    client: "TechCorp Inc.",
    progress: 75,
    status: "on-track",
    dueDate: "Dec 20, 2024",
    budget: "$8,500",
    spent: "$6,375",
  },
  {
    id: 2,
    name: "StartupXYZ Mobile App",
    client: "StartupXYZ",
    progress: 45,
    status: "on-track",
    dueDate: "Jan 15, 2025",
    budget: "$15,000",
    spent: "$6,750",
  },
  {
    id: 3,
    name: "E-commerce Platform",
    client: "RetailCorp",
    progress: 30,
    status: "at-risk",
    dueDate: "Dec 30, 2024",
    budget: "$12,000",
    spent: "$4,200",
  },
  {
    id: 4,
    name: "Portfolio Website",
    client: "Creative Agency",
    progress: 90,
    status: "ahead",
    dueDate: "Dec 18, 2024",
    budget: "$3,500",
    spent: "$3,150",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "ahead":
      return "secondary"
    case "on-track":
      return "default"
    case "at-risk":
      return "destructive"
    case "delayed":
      return "destructive"
    default:
      return "outline"
  }
}

const getProgressColor = (progress: number, status: string) => {
  if (status === "at-risk" || status === "delayed") return "bg-destructive"
  if (status === "ahead") return "bg-secondary"
  return "bg-primary"
}

export function ProjectProgress() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Ongoing Projects
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {ongoingProjects.map((project) => (
          <div key={project.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-card-foreground">{project.name}</h4>
                <p className="text-xs text-muted-foreground">{project.client}</p>
              </div>
              <Badge variant={getStatusColor(project.status)} className="text-xs">
                {project.status.replace("-", " ")}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {project.dueDate}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {project.spent} / {project.budget}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
