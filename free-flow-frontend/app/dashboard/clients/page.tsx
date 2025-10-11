"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { CheckSquare, ArrowRight } from "lucide-react"

export default function TasksPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <CheckSquare className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Tasks Moved</h1>
          <p className="text-muted-foreground mb-4">
            Tasks are now organized under their respective projects. Navigate through Clients → Projects → Tasks.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Redirecting</span>
            <ArrowRight className="h-4 w-4" />
            <span>Clients</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
