"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, ArrowLeft, Loader2 } from "lucide-react"
import { clientsApi } from "@/lib/api"
import { toast } from "sonner"

export default function CreateClientPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    contact: "",
  })

  const createClientMutation = useMutation({
    mutationFn: clientsApi.create,
    onSuccess: () => {
      toast.success("Client created successfully!")
      queryClient.invalidateQueries({ queryKey: ["clients", "dashbboard_stats", "client"] })
      router.push("/dashboard")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create client")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createClientMutation.mutate(formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-gray-700" />
              Create New Client
            </h1>
            <p className="text-gray-600 text-sm">Add a new client to your project management system</p>
          </div>
        </div>

        {/* Form */}
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader className="border-b border-gray-100 bg-white">
            <CardTitle className="text-lg font-medium text-gray-900">Client Information</CardTitle>
            <CardDescription className="text-gray-600">Enter the details for your new client</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-medium text-gray-900">
                  Company Name *
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="Enter company name"
                  required
                  className="h-10 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="client@company.com"
                  required
                  className="h-10 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="text-sm font-medium text-gray-900">
                  Contact Number *
                </Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  required
                  className="h-10 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createClientMutation.isPending}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {createClientMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Client"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
