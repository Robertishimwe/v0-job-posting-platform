"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Search, Eye, Ban, CheckCircle, Building2, Briefcase, FileText } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Organization {
  id: string
  company_name: string
  contact_person: string
  email: string
  status: string
  created_at: string
  jobs_count?: number
  applications_count?: number
}

interface OrganizationDetails extends Organization {
  jobs: Array<{
    id: string
    title: string
    status: string
    applications_count: number
  }>
}

interface AdminOrganizationsTableProps {
  organizations: Organization[]
}

export function AdminOrganizationsTable({ organizations: initialOrgs }: AdminOrganizationsTableProps) {
  const [organizations, setOrganizations] = useState(initialOrgs)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrg, setSelectedOrg] = useState<OrganizationDetails | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || org.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (orgId: string, newStatus: string) => {
    const { error } = await supabase
      .from("organizations")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", orgId)

    if (!error) {
      setOrganizations((prev) => prev.map((org) => (org.id === orgId ? { ...org, status: newStatus } : org)))
      router.refresh()
    }
  }

  const viewOrgDetails = async (org: Organization) => {
    setIsLoading(true)

    // Fetch jobs for this organization
    const { data: jobs } = await supabase.from("jobs").select("id, title, status").eq("organization_id", org.id)

    // Fetch application counts for each job
    const jobsWithCounts = await Promise.all(
      (jobs || []).map(async (job) => {
        const { count } = await supabase
          .from("applications")
          .select("*", { count: "exact", head: true })
          .eq("job_id", job.id)
        return { ...job, applications_count: count || 0 }
      }),
    )

    setSelectedOrg({
      ...org,
      jobs: jobsWithCounts,
    })
    setIsDetailsOpen(true)
    setIsLoading(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" style={{ color: "#1A0D66" }} />
            Organizations
          </CardTitle>
          <CardDescription>Manage registered organizations and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company, email, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredOrgs.length} of {organizations.length} organizations
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Jobs</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No organizations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrgs.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">{org.company_name}</TableCell>
                      <TableCell>{org.contact_person}</TableCell>
                      <TableCell>{org.email}</TableCell>
                      <TableCell>{org.jobs_count || 0}</TableCell>
                      <TableCell>{org.applications_count || 0}</TableCell>
                      <TableCell>{getStatusBadge(org.status)}</TableCell>
                      <TableCell>{new Date(org.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => viewOrgDetails(org)} title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {org.status === "active" ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStatusChange(org.id, "suspended")}
                              title="Suspend"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStatusChange(org.id, "active")}
                              title="Activate"
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Organization Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" style={{ color: "#1A0D66" }} />
              {selectedOrg?.company_name}
            </DialogTitle>
            <DialogDescription>Organization details and statistics</DialogDescription>
          </DialogHeader>

          {selectedOrg && (
            <div className="space-y-6">
              {/* Organization Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-medium">{selectedOrg.contact_person}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedOrg.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedOrg.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{new Date(selectedOrg.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" style={{ color: "#C89333" }} />
                      <div>
                        <p className="text-2xl font-bold">{selectedOrg.jobs?.length || 0}</p>
                        <p className="text-sm text-muted-foreground">Total Jobs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" style={{ color: "#10B981" }} />
                      <div>
                        <p className="text-2xl font-bold">
                          {selectedOrg.jobs?.reduce((sum, job) => sum + job.applications_count, 0) || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Applications</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Jobs List */}
              <div>
                <h4 className="font-semibold mb-3">Job Postings</h4>
                {selectedOrg.jobs?.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No jobs posted yet</p>
                ) : (
                  <div className="space-y-2">
                    {selectedOrg.jobs?.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-muted-foreground">{job.applications_count} applications</p>
                        </div>
                        <Badge variant={job.status === "active" ? "default" : "secondary"}>{job.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
