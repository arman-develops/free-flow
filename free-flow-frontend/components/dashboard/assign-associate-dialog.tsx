"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, UserCheck, Star, Mail, Phone } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useUpdateTask } from "@/hooks/use-tasks"

interface Associate {
  id: string
  name: string
  email: string
  phone: string
  skills: string[]
  rating: number
  status: string
}

interface AssignAssociatesDialogProps {
  isOpen: boolean
  onClose: () => void
  taskId: string
  taskTitle: string
  currentAssociateId?: string
  associates: Associate[]
}

export function AssignAssociatesDialog({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  currentAssociateId,
  associates,
}: AssignAssociatesDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAssociateId, setSelectedAssociateId] = useState<string | null>(currentAssociateId || null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateTask = useUpdateTask()

  const filteredAssociates = useMemo(() => {
    return associates.filter(
      (associate) =>
        associate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        associate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        associate.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [associates, searchTerm])

  const handleAssign = async () => {
    if (!selectedAssociateId) {
      toast.error("Please select an associate")
      return
    }

    setIsSubmitting(true)
    try {
      const data = {
        assigned_to_associate: selectedAssociateId
      }
      updateTask.mutateAsync({id: taskId, data})
      const associate = associates.find((a) => a.id === selectedAssociateId)
      toast.success(`Task assigned to ${associate?.name}`)
      onClose()
    } catch (error) {
      toast.error("Failed to assign task")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Assign Associate</DialogTitle>
          <DialogDescription>
            Select an associate to assign to <span className="font-semibold text-gray-900">{taskTitle}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-gray-600">{filteredAssociates.length} associate(s) available</span>
            {selectedAssociateId && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedAssociateId(null)} className="text-sm">
                Clear Selection
              </Button>
            )}
          </div>
        </div>

        {/* Scrollable Associates List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredAssociates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserCheck className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-600 font-medium">No associates found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAssociates.map((associate) => {
                const isSelected = selectedAssociateId === associate.id
                const isCurrent = currentAssociateId === associate.id

                return (
                  <div
                    key={associate.id}
                    onClick={() => setSelectedAssociateId(associate.id)}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-sm",
                      isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {getInitials(associate.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{associate.name}</h4>
                        {isCurrent && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Current
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={
                            associate.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }
                        >
                          {associate.status || "Active"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mb-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {associate.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {associate.phone}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-900">{associate.rating || "4.5"}</span>
                        </div>
                      </div>

                      {associate.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {associate.skills.slice(0, 5).map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-gray-100">
                              {skill}
                            </Badge>
                          ))}
                          {associate.skills.length > 5 && (
                            <Badge variant="secondary" className="text-xs bg-gray-100">
                              +{associate.skills.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                          <UserCheck className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedAssociateId || isSubmitting}
              className="flex-1 bg-gray-900 hover:bg-gray-800"
            >
              {isSubmitting ? "Assigning..." : "Assign Associate"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
