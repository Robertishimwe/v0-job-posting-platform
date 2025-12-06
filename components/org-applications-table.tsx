"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Download } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function OrgApplicationsTable({ applications }: { applications: any[] }) {
  const [appsList, setAppsList] = useState(applications)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const supabase = createClient()

  const filteredApplications = appsList.filter((app) => {
    const matchesSearch =
      app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobs?.title?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (appId: string, newStatus: string) => {
    const { error } = await supabase.from("applications").update({ status: newStatus }).eq("id", appId)

    if (!error) {
      setAppsList(appsList.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)))
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
    <div>
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by name, email, or job..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredApplications.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No applications found</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Job Position</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.full_name || "N/A"}</TableCell>
                <TableCell>{app.email || "N/A"}</TableCell>
                <TableCell>{app.jobs?.title || "N/A"}</TableCell>
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
    </div>
  )
}
