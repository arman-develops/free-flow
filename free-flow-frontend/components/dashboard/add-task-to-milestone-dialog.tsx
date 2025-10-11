"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, CheckCircle2, Plus, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { milestoneApi } from "@/lib/api"
import { queryClient } from "@/lib/query-client"

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  estimated_hours: number
}

interface AddTasksToMilestoneDialogProps {
  isOpen: boolean
  onClose: () => void
  milestoneId: string
  milestoneName: string
  availableTasks: Task[]
  existingTaskIds?: string[]
}

export function AddTasksToMilestoneDialog({
  isOpen,
  onClose,
  milestoneId,
  milestoneName,
  availableTasks,
  existingTaskIds = [],
}: AddTasksToMilestoneDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredTasks = useMemo(() => {
    return availableTasks.filter(
      (task) =>
        !existingTaskIds.includes(task.id) &&
        (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [availableTasks, existingTaskIds, searchTerm])

  const addTasksMutation = useMutation({
    mutationFn: ({milestoneID, selectedTaskIDs}: {milestoneID: string, selectedTaskIDs: string[]}) => milestoneApi.addTasks(milestoneID, selectedTaskIDs),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["milestones"]})
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add task(s)")
    },
  })

  const handleToggleTask = (taskId: string) => {
    setSelectedTaskIds((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const handleSelectAll = () => {
    if (selectedTaskIds.length === filteredTasks.length) {
      setSelectedTaskIds([])
    } else {
      setSelectedTaskIds(filteredTasks.map((task) => task.id))
    }
  }

  const handleAddTasks = async () => {
    if (selectedTaskIds.length === 0) {
      toast.error("Please select at least one task")
      return
    }

    setIsSubmitting(true)
    try {
      addTasksMutation.mutateAsync({milestoneID: milestoneId, selectedTaskIDs: selectedTaskIds})
      toast.success(`${selectedTaskIds.length} task(s) added to milestone`)
      setSelectedTaskIds([])
      setSearchTerm("")
      onClose()
    } catch (error) {
      toast.error("Failed to add tasks to milestone")
    } finally {
      setIsSubmitting(false)
    }
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Add Tasks to Milestone</DialogTitle>
          <DialogDescription>
            Select tasks to add to <span className="font-semibold text-gray-900">{milestoneName}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <Button variant="ghost" size="sm" onClick={handleSelectAll} className="text-sm">
              {selectedTaskIds.length === filteredTasks.length ? "Deselect All" : "Select All"}
            </Button>
            <span className="text-sm text-gray-600">{filteredTasks.length} task(s) available</span>
          </div>
        </div>

        {/* Scrollable Task List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-600 font-medium">No tasks available</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchTerm ? "Try adjusting your search" : "All tasks are already in this milestone"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map((task) => {
                const isSelected = selectedTaskIds.includes(task.id)
                return (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-sm",
                      isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <Checkbox checked={isSelected} onCheckedChange={() => handleToggleTask(task.id)} className="mt-1" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{task.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">{task.estimated_hours}h estimated</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Sticky Bottom Bar */}
        {selectedTaskIds.length > 0 && (
          <div className="sticky top-0 px-6 py-4 bg-white border-t shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-700">{selectedTaskIds.length}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {selectedTaskIds.length} task{selectedTaskIds.length > 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTaskIds([])}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
                <Button
                  onClick={handleAddTasks}
                  disabled={isSubmitting}
                  className="gap-2 bg-gray-900 hover:bg-gray-800"
                >
                  <Plus className="h-4 w-4" />
                  {isSubmitting ? "Adding..." : "Add to Milestone"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Footer when no selection */}
        {selectedTaskIds.length === 0 && (
          <div className="px-6 py-4 border-t">
            <Button variant="outline" onClick={onClose} className="w-full bg-transparent">
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
