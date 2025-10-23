"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Mail, Phone } from "lucide-react"
import type { ApplicationWithJob } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ApplicationsTableProps {
  applications: ApplicationWithJob[]
}

export function ApplicationsTable({ applications: initialApplications }: ApplicationsTableProps) {
  const [applications, setApplications] = useState(initialApplications)
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithJob | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const supabase = createClient()

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    const { error } = await supabase.from("applications").update({ status: newStatus }).eq("id", applicationId)

    if (!error) {
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus as any } : app)),
      )
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: { backgroundColor: "#FEF3C7", color: "#92400E" },
      shortlisted: { backgroundColor: "#D1FAE5", color: "#065F46" },
      rejected: { backgroundColor: "#FEE2E2", color: "#991B1B" },
    }
    return styles[status as keyof typeof styles] || styles.pending
  }

  const viewApplication = (application: ApplicationWithJob) => {
    setSelectedApplication(application)
    setIsDialogOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle style={{ color: "#1A0D66" }}>Applications</CardTitle>
          <CardDescription>Review and manage job applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Job Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No applications yet
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{application.full_name}</div>
                          <div className="text-sm text-muted-foreground">{application.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{application.jobs.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{application.jobs.department}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(application.applied_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={application.status}
                          onValueChange={(value) => handleStatusChange(application.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue>
                              <Badge style={getStatusBadge(application.status)}>{application.status}</Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="shortlisted">Shortlisted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewApplication(application)}
                          style={{ color: "#C89333" }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle style={{ color: "#1A0D66" }}>Application Details</DialogTitle>
                <DialogDescription>Application for {selectedApplication.jobs.title} position</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: "#1A0D66" }}>
                    Applicant Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Name:</span>
                      <span>{selectedApplication.full_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" style={{ color: "#C89333" }} />
                      <a href={`mailto:${selectedApplication.email}`} className="hover:underline">
                        {selectedApplication.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" style={{ color: "#C89333" }} />
                      <a href={`tel:${selectedApplication.phone}`} className="hover:underline">
                        {selectedApplication.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Applied:</span>
                      <span>
                        {new Date(selectedApplication.applied_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedApplication.cover_letter && (
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: "#1A0D66" }}>
                      Cover Letter
                    </h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm whitespace-pre-line leading-relaxed">{selectedApplication.cover_letter}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2" style={{ color: "#1A0D66" }}>
                    Update Status
                  </h3>
                  <Select
                    value={selectedApplication.status}
                    onValueChange={(value) => {
                      handleStatusChange(selectedApplication.id, value)
                      setSelectedApplication({ ...selectedApplication, status: value as any })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
