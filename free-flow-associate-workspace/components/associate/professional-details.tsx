// Updated ProfileSetup Component
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ProfessionalDetailsSetupProps {
  onComplete: (data: {
    linkedin_url?: string
    portfolio_url?: string
    website_url?: string
    skills?: string[]
  }) => void
  onSkip?: () => void
}

export function ProfessionalDetailsSetup({ onComplete, onSkip }: ProfessionalDetailsSetupProps) {
  const [linkedinProfile, setLinkedinProfile] = useState("")
  const [portfolioLink, setPortfolioLink] = useState("")
  const [websiteLink, setWebsiteLink] = useState("")
  const [skillInput, setSkillInput] = useState("")
  const [skills, setSkills] = useState<string[]>([])

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddSkill()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete({
      linkedin_url: linkedinProfile || "",
      portfolio_url: portfolioLink || "",
      website_url: websiteLink || "",
      skills: skills.length > 0 ? skills : [],
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Details</CardTitle>
        <CardDescription>
          Share your professional presence and expertise (all optional)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* LinkedIn Profile */}
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn Profile</Label>
            <Input
              id="linkedin"
              type="url"
              value={linkedinProfile}
              onChange={(e) => setLinkedinProfile(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          {/* Portfolio Link */}
          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio Link</Label>
            <Input
              id="portfolio"
              type="url"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              placeholder="https://yourportfolio.com"
            />
          </div>

          {/* Website Link */}
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={websiteLink}
              onChange={(e) => setWebsiteLink(e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <div className="flex gap-2">
              <Input
                id="skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a skill (press Enter)"
              />
              <Button type="button" onClick={handleAddSkill} variant="secondary">
                Add
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            {onSkip && (
              <Button type="button" variant="outline" className="flex-1" onClick={onSkip}>
                Skip for Now
              </Button>
            )}
            <Button type="submit" className="flex-1">
              Complete Setup
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}