"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { useAssociateStore } from "@/stores/associate-store"
import { OnboardingSteps } from "@/components/associate/onboarding-steps"
import { PasswordSetup } from "@/components/associate/password-setup"
import { ProfileSetup } from "@/components/associate/profile-setup"
import { WelcomeScreen } from "@/components/associate/welcome-screen"
import { Loader2 } from "lucide-react"

interface OnboardingData {
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone?: string
  timezone?: string
}

export default function OnboardingPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({})
  const setAssociate = useAssociateStore((state) => state.setAssociate)
  const setIsAuthenticated = useAssociateStore((state) => state.setIsAuthenticated)

  const completeMutation = useMutation({
    mutationFn: async (data: OnboardingData) => {
      const response = await apiClient.post(`/associate/onboarding/${token}`, data)
      return response.data
    },
    onSuccess: (data) => {
      // Store auth token
      localStorage.setItem("associate-token", data.token)
      // Set associate data
      setAssociate(data.associate)
      setIsAuthenticated(true)
      // Move to welcome screen
      setCurrentStep(4)
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/associate/dashboard")
      }, 3000)
    },
  })

  const handlePasswordComplete = (data: { password: string; confirmPassword: string }) => {
    setOnboardingData((prev) => ({ ...prev, ...data }))
    setCurrentStep(2)
  }

  const handleProfileComplete = (data: {
    firstName: string
    lastName: string
    phone?: string
    timezone?: string
  }) => {
    const completeData = { ...onboardingData, ...data } as OnboardingData
    setOnboardingData(completeData)
    setCurrentStep(3)
    // Submit onboarding
    completeMutation.mutate(completeData)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-foreground">Freeflow</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        {currentStep < 4 && <OnboardingSteps currentStep={currentStep} />}

        {/* Step Content */}
        <div className="mt-8">
          {currentStep === 1 && <PasswordSetup onComplete={handlePasswordComplete} />}

          {currentStep === 2 && <ProfileSetup onComplete={handleProfileComplete} />}

          {currentStep === 3 && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-lg font-medium text-foreground">Setting up your workspace...</p>
                <p className="text-sm text-muted-foreground">This will only take a moment</p>
              </div>
            </div>
          )}

          {currentStep === 4 && <WelcomeScreen />}
        </div>
      </div>
    </div>
  )
}
