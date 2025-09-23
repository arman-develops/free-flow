"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  X,
  Edit3,
  Save,
  Share2,
  CheckCircle2,
  Clock,
  DollarSign,
  Mail,
  Phone,
  Building2,
  FolderOpen,
  ListTodo,
  Calendar,
  User,
  ExternalLink,
} from "lucide-react"
import { projectsApi } from "@/lib/api"

interface DetailPanelProps {
  isOpen: boolean
  onClose: () => void
  type: "client" | "project" | "task" | null
  data: any
  client?: any
}

export function DetailPanel({ isOpen, onClose, type, data, client }: DetailPanelProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(data)
  const [notes, setNotes] = useState("")

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects", data?.id],
    queryFn: () => projectsApi.getProjectByClientID(data.id),
    enabled: type === "client" && !!data?.id,
  })

  useEffect(() => {
    setEditData(data)
    setNotes(data?.notes || "")
  }, [data])

  if (!isOpen || !type || !data) return null

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving:", editData)
    setIsEditing(false)
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

  const renderProjectDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <FolderOpen className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{data.name}</h3>
          <p className="text-sm text-gray-500">Project for {client?.companyName}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span className="text-sm">Estimated Value: ${data.estimated_value}</span>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">Created {new Date(data.CreatedAt || Date.now()).toLocaleDateString()}</span>
        </div>
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

      <div className="pt-2">
        <Button onClick={() => handleProjectClick(data.id)} variant="outline" className="w-full">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Project Details & Tasks
        </Button>
      </div>
    </div>
  )

  const renderTaskDetails = () => (
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
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            Estimated: {data.estimated_hours}h | Actual: {data.actual_hours || 0}h
          </span>
        </div>
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{data.assigned_associate ? "Assigned to Associate" : "Unassigned"}</span>
        </div>
        {data.due_date && (
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm">Due: {new Date(data.due_date).toLocaleDateString()}</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">Created: {new Date(data.created_at).toLocaleDateString()}</span>
        </div>
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

      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Status & Priority</h4>
        <div className="flex gap-2">
          <Badge variant={data.status === "completed" ? "default" : "secondary"}>{data.status || "todo"}</Badge>
          <Badge variant="outline" className={getPriorityColor(data.priority || "medium")}>
            {data.priority || "medium"}
          </Badge>
        </div>
      </div>

      {data.completed_at && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Completion</h4>
          <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
            Completed on {new Date(data.completed_at).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  )

  const renderNotes = () => (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Notes</h4>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add your notes here..."
        className="min-h-[100px]"
      />
    </div>
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Details</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="text-gray-600 hover:text-gray-900"
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
        {type === "project" && renderProjectDetails()}
        {type === "task" && renderTaskDetails()}

        {renderNotes()}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {isEditing && (
          <Button onClick={handleSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        )}

        {type === "task" && (
          <Button onClick={handleMarkComplete} variant="outline" className="w-full bg-transparent">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark Complete
          </Button>
        )}

        <Button onClick={handleShare} variant="outline" className="w-full bg-transparent">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  )
}
