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
        <div className="p-6 space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
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
        {activeProjects.length > 0 ? (
          activeProjects.map((project: any) => (
            <div
              key={project.id}
              className="space-y-3 border-b cursor-pointer transition-colors hover:bg-gray-50 px-3 py-2 rounded-md"
              onClick={() => handleProjectClick(project)}
            >
              {/* Top: Name + Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-card-foreground">
                    {project.name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {project.description || "No description provided"}
                  </p>
                </div>
                <Badge
                  variant={getStatusColor(project.status)}
                  className="text-xs capitalize"
                >
                  {project.status.replace("-", " ")}
                </Badge>
              </div>

              {/* Middle: Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress || 0}%</span>
                </div>
                <Progress value={project.progress || 0} className="h-2" />
              </div>

              {/* Bottom: Metadata */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pb-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {project.deadline ? (
                    `Deadline: ${new Date(project.deadline).toLocaleDateString()}`
                  ) : (
                    "Deadline: Not set"
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {project.actual_value
                    ? `KSh ${Number(project.actual_value).toLocaleString()}`
                    : "Value: N/A"}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
            <FolderOpen className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-700">No active projects yet</p>
            <p className="text-xs text-gray-500 mt-1">
              Projects that are currently in progress will appear here once you start one.
            </p>
          </div>
        )}
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
