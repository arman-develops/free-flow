"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PasswordSetupProps {
  onComplete: (data: { password: string }) => void
}

interface PasswordRequirement {
  label: string
  met: boolean
}

export function PasswordSetup({ onComplete }: PasswordSetupProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [touched, setTouched] = useState(false)

  const requirements: PasswordRequirement[] = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ]

  const allRequirementsMet = requirements.every((req) => req.met)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0
  const canSubmit = allRequirementsMet && passwordsMatch

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canSubmit) {
      onComplete({ password })
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Set Your Password</CardTitle>
            <CardDescription className="mt-1">Create a secure password for your account</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setTouched(true)
                }}
                placeholder="Enter your password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          {touched && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-foreground mb-3">Password Requirements:</p>
              <div className="grid gap-2">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center transition-colors",
                        req.met ? "bg-success text-success-foreground" : "bg-muted-foreground/20",
                      )}
                    >
                      {req.met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    <span className={cn("text-sm", req.met ? "text-foreground" : "text-muted-foreground")}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <X className="h-3 w-3" />
                Passwords do not match
              </p>
            )}
            {passwordsMatch && (
              <p className="text-sm text-success flex items-center gap-1">
                <Check className="h-3 w-3" />
                Passwords match
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={!canSubmit}>
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
