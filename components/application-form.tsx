"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Upload, FileText, X } from "lucide-react"

interface ApplicationFormProps {
  jobId: string
  jobTitle: string
}

export function ApplicationForm({ jobId, jobTitle }: ApplicationFormProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [isUploadingResume, setIsUploadingResume] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed for resumes")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume file size must be less than 5MB")
      return
    }

    setResumeFile(file)
    setError(null)

    setIsUploadingResume(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to upload resume")
      }

      const data = await response.json()
      setResumeUrl(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload resume")
      setResumeFile(null)
    } finally {
      setIsUploadingResume(false)
    }
  }

  const removeResume = () => {
    setResumeFile(null)
    setResumeUrl(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: insertError } = await supabase.from("applications").insert({
        job_id: jobId,
        full_name: fullName,
        email,
        phone,
        cover_letter: coverLetter || null,
        resume_url: resumeUrl,
        status: "pending",
      })

      if (insertError) throw insertError

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card style={{ borderColor: "#E6A940" }}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16" style={{ color: "#C89333" }} />
            </div>
            <h3 className="text-xl font-semibold" style={{ color: "#1A0D66" }}>
              Application Submitted!
            </h3>
            <p className="text-sm text-muted-foreground">
              Thank you for applying. We'll review your application and get back to you soon.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card style={{ borderColor: "#E6A940" }}>
      <CardHeader>
        <CardTitle style={{ color: "#1A0D66" }}>Apply for this Position</CardTitle>
        <CardDescription>Fill out the form below to submit your application</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+250 XXX XXX XXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell us why you're a great fit for this role..."
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">Resume (PDF) *</Label>
            <div className="space-y-2">
              {!resumeFile ? (
                <div className="flex items-center gap-2">
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeChange}
                    disabled={isUploadingResume}
                    required
                    className="cursor-pointer"
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted">
                  <FileText className="h-5 w-5" style={{ color: "#C89333" }} />
                  <span className="text-sm flex-1 truncate">{resumeFile.name}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={removeResume} disabled={isUploadingResume}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {isUploadingResume && <p className="text-xs text-muted-foreground">Uploading resume...</p>}
              <p className="text-xs text-muted-foreground">Upload your resume in PDF format (max 5MB)</p>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isUploadingResume || !resumeUrl}
            style={{ backgroundColor: "#C89333", color: "white" }}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
