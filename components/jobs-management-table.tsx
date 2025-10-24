"use client"

import { useState } from "react"
import type { Job } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Eye, Download, Power } from "lucide-react"
import { JobForm } from "@/components/job-form"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface JobsManagementTableProps {
  jobs: Job[]
}

export function JobsManagementTable({ jobs }: JobsManagementTableProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isToggling, setIsToggling] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) return

    setIsDeleting(jobId)
    const { error } = await supabase.from("jobs").delete().eq("id", jobId)

    if (error) {
      alert("Error deleting job: " + error.message)
    } else {
      router.refresh()
    }
    setIsDeleting(null)
  }

  const handleToggleStatus = async (job: Job) => {
    const newStatus = job.status === "active" ? "inactive" : "active"
    setIsToggling(job.id)

    const { error } = await supabase.from("jobs").update({ status: newStatus }).eq("id", job.id)

    if (error) {
      alert("Error updating job status: " + error.message)
    } else {
      router.refresh()
    }
    setIsToggling(null)
  }

  const handleExport = () => {
    const csvContent = [
      ["Title", "Department", "Location", "Type", "Status", "Posted Date", "Deadline"].join(","),
      ...jobs.map((job) =>
        [
          job.title,
          job.department,
          job.location,
          job.type,
          job.status,
          new Date(job.posted_date).toLocaleDateString(),
          job.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `jobs-export-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleEdit = (job: Job) => {
    setSelectedJob(job)
    setIsFormOpen(true)
  }

  const handleAddNew = () => {
    setSelectedJob(null)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: "#1A0D66" }}>
          Jobs Management
        </h2>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} size="sm" style={{ backgroundColor: "#C89333", color: "white" }}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedJob ? "Edit Job" : "Add New Job"}</DialogTitle>
              </DialogHeader>
              <JobForm job={selectedJob} onSuccess={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Posted Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No jobs found. Click "Add New Job" to create one.
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{job.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={job.status === "active" ? "default" : "secondary"}>
                      {job.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(job.posted_date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/jobs/${job.id}/applications`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(job)}
                        disabled={isToggling === job.id}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(job)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(job.id)}
                        disabled={isDeleting === job.id}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
