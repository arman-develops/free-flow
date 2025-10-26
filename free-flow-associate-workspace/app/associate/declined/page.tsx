"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DeclinedPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">Invitation Declined</h1>
            <p className="text-muted-foreground leading-relaxed">
              You have declined this invitation. The freelancer will be notified of your decision.
            </p>
          </div>
          <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/associate/dashboard")}>
            Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
