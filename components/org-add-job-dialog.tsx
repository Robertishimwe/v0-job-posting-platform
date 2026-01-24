"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/rich-text-editor"
import { createClient } from "@/lib/supabase/client"

export function OrgAddJobDialog({
  isOpen,
  onOpenChange,
  onJobAdded,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onJobAdded: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "full-time",
    description: "",
    requirements: "",
    responsibilities: "",
    salary_range: "",
    deadline: "",
  })
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const organizationId = localStorage.getItem("organization_id")

      console.log("[v0] Submitting job with organization_id:", organizationId)

      if (!organizationId) {
        throw new Error("Organization not found. Please log in again.")
      }

      const { error } = await supabase.from("jobs").insert([
        {
          ...formData,
          organization_id: organizationId,
          status: "active",
          posted_date: new Date().toISOString(),
        },
      ])

      if (error) throw error

      setFormData({
        title: "",
        department: "",
        location: "",
        type: "full-time",
        description: "",
        requirements: "",
        responsibilities: "",
        salary_range: "",
        deadline: "",
      })

      onOpenChange(false)
      onJobAdded()
    } catch (error) {
      console.error("Error posting job:", error)
      alert(`Failed to post job: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a New Job</DialogTitle>
          <DialogDescription>Fill in the details for your new job posting</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="type">Job Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <RichTextEditor
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            label="Job Description"
            placeholder="Provide a detailed description of the role..."
            required
          />

          <RichTextEditor
            value={formData.requirements}
            onChange={(value) => setFormData({ ...formData, requirements: value })}
            label="Requirements"
            placeholder="List the required qualifications and skills..."
          />

          <RichTextEditor
            value={formData.responsibilities}
            onChange={(value) => setFormData({ ...formData, responsibilities: value })}
            label="Responsibilities"
            placeholder="Describe the key responsibilities..."
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salary_range">Salary Range</Label>
              <Input
                id="salary_range"
                value={formData.salary_range}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="deadline">Application Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} style={{ backgroundColor: "#C89333", color: "white" }}>
              {isLoading ? "Posting..." : "Post Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
