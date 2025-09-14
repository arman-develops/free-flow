import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function MessagesPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="h-8 w-8" />
                Messages
              </h1>
              <p className="text-muted-foreground">Communicate with clients and team members.</p>
            </div>
          </div>

          {/* Placeholder Content */}
          <Card>
            <CardHeader>
              <CardTitle>Messages Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The messaging system is under development. This will include client communication, team chat, and
                project discussions.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
