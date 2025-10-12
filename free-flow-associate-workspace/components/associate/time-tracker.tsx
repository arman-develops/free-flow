"use client"

import { useEffect, useState } from "react"
import { useTaskStore } from "@/stores/task-store"
import { Button } from "@/components/ui/button"
import { Pause } from "lucide-react"
import { format } from "date-fns"

export function TimeTracker() {
  const { activeTimeEntry, stopTimer } = useTaskStore()
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!activeTimeEntry) return

    const interval = setInterval(() => {
      const start = new Date(activeTimeEntry.startTime).getTime()
      const now = Date.now()
      setElapsed(Math.floor((now - start) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [activeTimeEntry])

  if (!activeTimeEntry) return null

  const hours = Math.floor(elapsed / 3600)
  const minutes = Math.floor((elapsed % 3600) / 60)
  const seconds = elapsed % 60

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <h3 className="font-semibold text-foreground">{activeTimeEntry.taskTitle}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{activeTimeEntry.projectName}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-2xl font-mono font-semibold text-foreground">
            {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <p className="text-xs text-muted-foreground">
            Started {format(new Date(activeTimeEntry.startTime), "h:mm a")}
          </p>
        </div>

        <Button variant="destructive" onClick={stopTimer} className="gap-2">
          <Pause className="h-4 w-4" />
          Stop
        </Button>
      </div>
    </div>
  )
}
