"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderOpen, ArrowRight, Calendar, DollarSign, Loader2 } from "lucide-react";
import { useState } from "react";
import { DetailPanel } from "./details-panel";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "@/lib/api";

const getStatusColor = (status: string) => {
  switch (status) {
    case "ahead":
      return "secondary";
    case "on-track":
      return "default";
    case "at-risk":
      return "destructive";
    case "delayed":
      return "destructive";
    default:
      return "outline";
  }
};

export function ProjectProgress() {
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  
  const handleProjectClick = (project:any) => {
    setIsProjectDetailOpen(true)
    setSelectedProject(project)
  }

  const {
    data: activeProjectsRequest,
    isLoading,
    error
  } = useQuery ({
    queryKey: ["projects"],
    queryFn: projectsApi.getProjectByUser
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

  const allProjects = activeProjectsRequest?.success ? activeProjectsRequest.data : []
  
  const activeProjects = allProjects.filter((project:any) => project.status === "active")

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
        {activeProjects.map((project:any) => (
          <div key={project.id} className="space-y-3 border-b-1 cursor-pointer transition-shadow hover:bg-gray-50" onClick={() => handleProjectClick(project)}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-card-foreground">
                  {project.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {project.description}
                </p>
              </div>
              <Badge
                variant={getStatusColor(project.status)}
                className="text-xs"
              >
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

            <div className="flex items-center justify-between text-xs text-muted-foreground pb-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {project.deadline ? `Deadline: ${project.deadline}` : "Deadline: Not set"}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {project.actual_value}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <DetailPanel
          isOpen={isProjectDetailOpen}
          onClose={() => setIsProjectDetailOpen(false)}
          type="project"
          data={selectedProject}
        />
    </Card>
  );
}
