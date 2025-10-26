"use client"

import { useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Eye, Mail, Phone, FileText, Download, Search } from "lucide-react"
import type { ApplicationWithJob } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ApplicationsTableProps {
  applications: ApplicationWithJob[]
}

export function ApplicationsTable({ applications: initialApplications }: ApplicationsTableProps) {
  const [applications, setApplications] = useState(initialApplications)
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithJob | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const supabase = createClient()

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    const { error } = await supabase.from("applications").update({ status: newStatus }).eq("id", applicationId)

    if (!error) {
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus as any } : app)),
      )
    }
  }

  // Filter and sort applications
  const filteredAndSortedApplications = useMemo(() => {
    const filtered = applications.filter((app) => {
      const matchesSearch =
        app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobs.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || app.status === statusFilter

      return matchesSearch && matchesStatus
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
        case "date-asc":
          return new Date(a.applied_at).getTime() - new Date(b.applied_at).getTime()
        case "name-asc":
          return a.full_name.localeCompare(b.full_name)
        case "name-desc":
          return b.full_name.localeCompare(a.full_name)
        default:
          return 0
      }
    })

    return filtered
  }, [applications, searchQuery, statusFilter, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedApplications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedApplications = filteredAndSortedApplications.slice(startIndex, startIndex + itemsPerPage)

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
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            Showing {paginatedApplications.length} of {filteredAndSortedApplications.length} applications
          </div>

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
                {paginatedApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No applications found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedApplications.map((application) => (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
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

                {selectedApplication.resume_url && (
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: "#1A0D66" }}>
                      Resume
                    </h3>
                    <a
                      href={selectedApplication.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <FileText className="h-4 w-4" style={{ color: "#C89333" }} />
                      <span className="text-sm">View Resume</span>
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                )}

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
