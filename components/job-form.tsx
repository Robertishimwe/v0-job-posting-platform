"use client"

import type React from "react"

import { useState } from "react"
import type { Job } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/rich-text-editor"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface JobFormProps {
  job?: Job | null
  onSuccess: () => void
}

export function JobForm({ job, onSuccess }: JobFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [description, setDescription] = useState(job?.description || "")
  const [requirements, setRequirements] = useState(job?.requirements || "")
  const [responsibilities, setResponsibilities] = useState(job?.responsibilities || "")
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const jobData = {
      title: formData.get("title") as string,
      department: formData.get("department") as string,
      location: formData.get("location") as string,
      type: formData.get("type") as string,
      description,
      requirements,
      responsibilities,
      salary_range: formData.get("salary_range") as string,
      deadline: formData.get("deadline") as string,
      status: formData.get("status") as string,
      posted_date: job ? job.posted_date : new Date().toISOString(),
      organization_id: localStorage.getItem("organization_id") || undefined,
    }

    let error
    if (job) {
      const result = await supabase.from("jobs").update(jobData).eq("id", job.id)
      error = result.error
    } else {
      const result = await supabase.from("jobs").insert([jobData])
      error = result.error
    }

    if (error) {
      alert("Error saving job: " + error.message)
    } else {
      router.refresh()
      onSuccess()
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title *</Label>
          <Input id="title" name="title" defaultValue={job?.title} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Input id="department" name="department" defaultValue={job?.department} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input id="location" name="location" defaultValue={job?.location} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Job Type *</Label>
          <Select name="type" defaultValue={job?.type || "Full-time"} required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="salary_range">Salary Range</Label>
          <Input
            id="salary_range"
            name="salary_range"
            defaultValue={job?.salary_range || ""}
            placeholder="e.g., $50,000 - $70,000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deadline">Application Deadline</Label>
          <Input id="deadline" name="deadline" type="date" defaultValue={job?.deadline?.split("T")[0]} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select name="status" defaultValue={job?.status || "active"} required>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <RichTextEditor
        value={description}
        onChange={setDescription}
        label="Job Description"
        placeholder="Provide a detailed description of the role..."
        required
      />

      <RichTextEditor
        value={requirements}
        onChange={setRequirements}
        label="Requirements"
        placeholder="List the required qualifications and skills..."
        required
      />

      <RichTextEditor
        value={responsibilities}
        onChange={setResponsibilities}
        label="Responsibilities"
        placeholder="Describe the key responsibilities..."
        required
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} style={{ backgroundColor: "#C89333", color: "white" }}>
          {isSubmitting ? "Saving..." : job ? "Update Job" : "Create Job"}
        </Button>
      </div>
    </form>
  )
}
