import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface OnboardingStepsProps {
  currentStep: number
}

const steps = [
  { number: 1, title: "Set Password", description: "Secure your account" },
  { number: 2, title: "Complete Profile", description: "Tell us about yourself" },
  { number: 3, title: "All Set", description: "Ready to start" },
]

export function OnboardingSteps({ currentStep }: OnboardingStepsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-10">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number
          const isCurrent = currentStep === step.number
          const isUpcoming = currentStep < step.number

          return (
            <div key={step.number} className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 bg-card border-2",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  isCurrent && "bg-primary border-primary text-primary-foreground scale-110",
                  isUpcoming && "border-border text-muted-foreground",
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : step.number}
              </div>
              <div className="mt-3 text-center">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    (isCompleted || isCurrent) && "text-foreground",
                    isUpcoming && "text-muted-foreground",
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
