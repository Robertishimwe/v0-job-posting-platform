"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function OrgViewApplicationsDialog({
  job,
  isOpen,
  onOpenChange,
}: {
  job: any
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const supabase = createClient()
  const [applications, setApplications] = useState(job.applications || [])

  const handleStatusChange = async (appId: string, newStatus: string) => {
    const { error } = await supabase.from("applications").update({ status: newStatus }).eq("id", appId)

    if (!error) {
      setApplications(applications.map((a: any) => (a.id === appId ? { ...a, status: newStatus } : a)))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#F59E0B"
      case "shortlisted":
        return "#10B981"
      case "rejected":
        return "#EF4444"
      default:
        return "#6B7280"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "N/A"
    return date.toLocaleDateString()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Applications for {job?.title}</DialogTitle>
          <DialogDescription>Review and manage applications</DialogDescription>
        </DialogHeader>

        {applications.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No applications yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app: any) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.full_name || "N/A"}</TableCell>
                  <TableCell>{app.email || "N/A"}</TableCell>
                  <TableCell>{formatDate(app.applied_at)}</TableCell>
                  <TableCell>
                    <Badge style={{ backgroundColor: getStatusColor(app.status), color: "white" }}>{app.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {app.resume_url ? (
                      <Button asChild variant="ghost" size="sm">
                        <a href={app.resume_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select value={app.status} onValueChange={(value) => handleStatusChange(app.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shortlisted">Shortlist</SelectItem>
                        <SelectItem value="rejected">Reject</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  )
}
