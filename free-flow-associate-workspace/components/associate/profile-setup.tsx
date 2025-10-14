"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { decodeJWT } from "@/utils/decode-token"
import { Textarea } from "@/components/ui/textarea"

interface ProfileSetupProps {
  token: string
  onComplete: (data: {
    phone_number?: string
    profile_photo_url?: string
    bio?: string
  }) => void
}

const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT)" },
]

export function ProfileSetup({ token, onComplete }: ProfileSetupProps) {
  const [phone, setPhone] = useState("")
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("")
  const [bio, setBio] = useState("")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const decoded = decodeJWT(token)
    if (decoded && (decoded.firstName || decoded.name)) {
      const fullName = decoded.name || `${decoded.firstName || ''} ${decoded.lastName || ''}`.trim()
      setUserName(fullName)
    }
  }, [token])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete({
      phone_number: phone || "",
      profile_photo_url: profilePhotoUrl || "",
      bio: bio || "",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>
          {userName && `Welcome, ${userName}! `}Tell us a bit more about yourself
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name (Read-only) */}
          {userName && (
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={userName} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Your name is already set</p>
            </div>
          )}

          {/* Profile Photo URL */}
          <div className="space-y-2">
            <Label htmlFor="profilePhoto">Profile Photo URL (Optional)</Label>
            <Input
              id="profilePhoto"
              type="url"
              value={profilePhotoUrl}
              onChange={(e) => setProfilePhotoUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
            />
            <p className="text-xs text-muted-foreground">Add a link to your profile picture</p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
            <p className="text-xs text-muted-foreground">We'll use this for important notifications</p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself, your experience, and what you're passionate about..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {bio.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
