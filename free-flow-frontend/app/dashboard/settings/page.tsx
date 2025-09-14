import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Settings className="h-8 w-8" />
                Settings
              </h1>
              <p className="text-muted-foreground">Configure your account and application preferences.</p>
            </div>
          </div>

          {/* Placeholder Content */}
          <Card>
            <CardHeader>
              <CardTitle>Settings Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Settings panel is under development. This will include profile management, notification preferences,
                billing settings, and more.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
