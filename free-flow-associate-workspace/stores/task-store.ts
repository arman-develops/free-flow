import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { Task, TimeEntry } from "@/types/associate"

interface TaskState {
  // Tasks
  tasks: Task[]
  activeTasks: Task[]
  completedTasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void

  // Time Tracking
  activeTimeEntry: TimeEntry | null
  timeEntries: TimeEntry[]
  startTimer: (taskId: string, taskTitle: string, projectId: string, projectName: string) => void
  stopTimer: () => void
  setTimeEntries: (entries: TimeEntry[]) => void
  addTimeEntry: (entry: TimeEntry) => void

  // Filters
  statusFilter: string[]
  priorityFilter: string[]
  projectFilter: string[]
  setStatusFilter: (filter: string[]) => void
  setPriorityFilter: (filter: string[]) => void
  setProjectFilter: (filter: string[]) => void
  clearFilters: () => void
}

export const useTaskStore = create<TaskState>()(
  devtools((set) => ({
    // Tasks
    tasks: [],
    activeTasks: [],
    completedTasks: [],
    setTasks: (tasks) =>
      set({
        tasks,
        activeTasks: tasks.filter((t) => t.status !== "completed"),
        completedTasks: tasks.filter((t) => t.status === "completed"),
      }),
    addTask: (task) =>
      set((state) => {
        const tasks = [task, ...state.tasks]
        return {
          tasks,
          activeTasks: tasks.filter((t) => t.status !== "completed"),
          completedTasks: tasks.filter((t) => t.status === "completed"),
        }
      }),
    updateTask: (id, updates) =>
      set((state) => {
        const tasks = state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
        return {
          tasks,
          activeTasks: tasks.filter((t) => t.status !== "completed"),
          completedTasks: tasks.filter((t) => t.status === "completed"),
        }
      }),
    deleteTask: (id) =>
      set((state) => {
        const tasks = state.tasks.filter((t) => t.id !== id)
        return {
          tasks,
          activeTasks: tasks.filter((t) => t.status !== "completed"),
          completedTasks: tasks.filter((t) => t.status === "completed"),
        }
      }),

    // Time Tracking
    activeTimeEntry: null,
    timeEntries: [],
    startTimer: (taskId, taskTitle, projectId, projectName) =>
      set({
        activeTimeEntry: {
          id: `temp-${Date.now()}`,
          taskId,
          taskTitle,
          projectId,
          projectName,
          startTime: new Date().toISOString(),
          duration: 0,
          billable: true,
          createdAt: new Date().toISOString(),
        },
      }),
    stopTimer: () =>
      set((state) => {
        if (!state.activeTimeEntry) return state
        const endTime = new Date().toISOString()
        const duration = Math.floor(
          (new Date(endTime).getTime() - new Date(state.activeTimeEntry.startTime).getTime()) / 60000,
        )
        const completedEntry = {
          ...state.activeTimeEntry,
          endTime,
          duration,
        }
        return {
          activeTimeEntry: null,
          timeEntries: [completedEntry, ...state.timeEntries],
        }
      }),
    setTimeEntries: (entries) => set({ timeEntries: entries }),
    addTimeEntry: (entry) =>
      set((state) => ({
        timeEntries: [entry, ...state.timeEntries],
      })),

    // Filters
    statusFilter: [],
    priorityFilter: [],
    projectFilter: [],
    setStatusFilter: (filter) => set({ statusFilter: filter }),
    setPriorityFilter: (filter) => set({ priorityFilter: filter }),
    setProjectFilter: (filter) => set({ projectFilter: filter }),
    clearFilters: () => set({ statusFilter: [], priorityFilter: [], projectFilter: [] }),
  })),
)
