"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit2, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { OrgEditJobDialog } from "./org-edit-job-dialog"
import { OrgViewApplicationsDialog } from "./org-view-applications-dialog"

export function OrgJobsTable({ jobs }: { jobs: any[] }) {
  const [editingJob, setEditingJob] = useState(null)
  const [viewingApplications, setViewingApplications] = useState(null)
  const [jobsList, setJobsList] = useState(jobs)
  const supabase = createClient()

  const handleStatusToggle = async (job: any) => {
    const newStatus = job.status === "active" ? "inactive" : "active"
    const { error } = await supabase.from("jobs").update({ status: newStatus }).eq("id", job.id)

    if (!error) {
      setJobsList(jobsList.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j)))
    }
  }

  const handleDelete = async (jobId: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      const { error } = await supabase.from("jobs").delete().eq("id", jobId)
      if (!error) {
        setJobsList(jobsList.filter((j) => j.id !== jobId))
      }
    }
  }

  if (jobsList.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No job postings yet. Create one to get started!</p>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Applications</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobsList.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell>{job.department}</TableCell>
              <TableCell>{job.type}</TableCell>
              <TableCell>{job.applications?.length || 0}</TableCell>
              <TableCell>
                <Badge style={{ backgroundColor: job.status === "active" ? "#10B981" : "#EF4444", color: "white" }}>
                  {job.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewingApplications(job)}
                    title="View Applications"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingJob(job)} title="Edit Job">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStatusToggle(job)}
                    title={job.status === "active" ? "Deactivate" : "Activate"}
                  >
                    {job.status === "active" ? (
                      <ToggleRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(job.id)} title="Delete Job">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingJob && (
        <OrgEditJobDialog
          job={editingJob}
          isOpen={!!editingJob}
          onOpenChange={() => setEditingJob(null)}
          onJobUpdated={(updatedJob) => {
            setJobsList(jobsList.map((j) => (j.id === updatedJob.id ? updatedJob : j)))
            setEditingJob(null)
          }}
        />
      )}

      {viewingApplications && (
        <OrgViewApplicationsDialog
          job={viewingApplications}
          isOpen={!!viewingApplications}
          onOpenChange={() => setViewingApplications(null)}
        />
      )}
    </>
  )
}
