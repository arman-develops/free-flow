"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ArrowLeft, Plus, FolderOpen, Calendar, DollarSign, FileText, Users } from "lucide-react"
import { clientsApi, projectsApi } from "@/lib/api"

interface Project {
  id: string
  name: string
  description: string
  estimated_value: number
  notes: string
  status: string
  CreatedAt: string
  UpdatedAt: string
}

interface Client {
  id: string
  companyName: string
  contact: string
  email: string
  projects: Project[]
  CreatedAt: string
}

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const clientId = params.id as string

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    estimated_value: "",
    notes: "",
  })

  // Fetch client details with projects
  const { data: client, isLoading } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => clientsApi.getClientsByUserID(),
  })

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: (data: any) => projectsApi.create({ ...data, entityID: clientId }),
    onSuccess: () => {
      toast.success("Project created successfully")
      setIsCreateProjectOpen(false)
      setProjectForm({ name: "", description: "", estimated_value: "", notes: "" })
      queryClient.invalidateQueries({ queryKey: ["client", clientId] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create project")
    },
  })

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    createProjectMutation.mutate({
      ...projectForm,
      estimated_value: Number.parseFloat(projectForm.estimated_value) || 0,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Client not found</h1>
        <Button onClick={() => router.push("/clients")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clients
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={() => router.push("/clients")} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.companyName}</h1>
            <p className="text-gray-600">{client.email}</p>
          </div>
        </div>
        <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Create a new project for {client.companyName}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_value">Estimated Value</Label>
                <Input
                  id="estimated_value"
                  type="number"
                  step="0.01"
                  value={projectForm.estimated_value}
                  onChange={(e) => setProjectForm({ ...projectForm, estimated_value: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={projectForm.notes}
                  onChange={(e) => setProjectForm({ ...projectForm, notes: e.target.value })}
                  placeholder="Additional notes (supports markdown)"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateProjectOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createProjectMutation.isPending}>
                  {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Client Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Company</Label>
              <p className="text-lg font-semibold">{client.companyName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Contact</Label>
              <p className="text-lg">{client.contact}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Email</Label>
              <p className="text-lg">{client.email}</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            Client since {new Date(client.CreatedAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      {/* Projects Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FolderOpen className="h-5 w-5 mr-2" />
              Projects ({client.projects?.length || 0})
            </div>
          </CardTitle>
          <CardDescription>Manage projects for {client.companyName}</CardDescription>
        </CardHeader>
        <CardContent>
          {!client.projects || client.projects.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first project for this client.</p>
              <Button onClick={() => setIsCreateProjectOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Project
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {client.projects.map((project:any) => (
                <Card
                  key={project.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                        <p className="text-gray-600 mb-3">{project.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />${project.estimated_value?.toLocaleString() || "0"}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(project.CreatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant={project.status === "active" ? "default" : "secondary"}>
                          {project.status || "Active"}
                        </Badge>
                        {project.notes && (
                          <div className="flex items-center text-gray-400">
                            <FileText className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
