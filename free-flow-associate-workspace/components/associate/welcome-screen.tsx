import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Sparkles } from "lucide-react"

export function WelcomeScreen() {
  return (
    <Card className="max-w-2xl mx-auto border-success/20">
      <CardContent className="pt-12 pb-12 text-center space-y-6">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-6 w-6 text-warning animate-pulse" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-foreground">Welcome to Freeflow!</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            Your workspace is ready. You'll be redirected to your dashboard in a moment.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-4">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </CardContent>
    </Card>
  )
}
