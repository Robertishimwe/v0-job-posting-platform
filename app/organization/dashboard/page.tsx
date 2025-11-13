"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { OrgHeader } from "@/components/org-header"
import { OrgStats } from "@/components/org-stats"
import { OrgJobsTable } from "@/components/org-jobs-table"
import { OrgApplicationsTable } from "@/components/org-applications-table"
import { OrgAddJobDialog } from "@/components/org-add-job-dialog"
import { createClient } from "@/lib/supabase/client"

export default function OrganizationDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [organizationId, setOrganizationId] = useState("")
  const [organizationName, setOrganizationName] = useState("")
  const [organizationEmail, setOrganizationEmail] = useState("")
  const [isAddJobOpen, setIsAddJobOpen] = useState(false)
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    shortlistedApplications: 0,
    pendingApplications: 0,
  })
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const orgId = localStorage.getItem("organization_id")
      const email = localStorage.getItem("organization_email")
      const name = localStorage.getItem("organization_name")

      if (!orgId) {
        router.push("/organization/login")
        return
      }

      setOrganizationId(orgId)
      setOrganizationEmail(email || "")
      setOrganizationName(name || "Organization")
      setIsAuthenticated(true)

      // Fetch organization's jobs
      const { data: jobsData } = await supabase
        .from("jobs")
        .select(
          `
          *,
          applications (
            id,
            status
          )
        `,
        )
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false })

      setJobs(jobsData || [])

      // Fetch organization's applications
      const { data: applicationsData } = await supabase
        .from("applications")
        .select(
          `
          id,
          applicant_name,
          applicant_email,
          applied_at,
          status,
          resume_url,
          jobs (
            id,
            title,
            department
          )
        `,
        )
        .in(
          "job_id",
          (jobsData || []).map((j: any) => j.id),
        )
        .order("applied_at", { ascending: false })

      setApplications(applicationsData || [])

      // Calculate stats
      const activeJobsCount = (jobsData || []).filter((j: any) => j.status === "active").length
      const totalApps = applicationsData?.length || 0
      const shortlisted = applicationsData?.filter((a: any) => a.status === "shortlisted").length || 0
      const pending = applicationsData?.filter((a: any) => a.status === "pending").length || 0

      setStats({
        activeJobs: activeJobsCount,
        totalApplications: totalApps,
        shortlistedApplications: shortlisted,
        pendingApplications: pending,
      })

      setIsLoading(false)
    }

    checkAuth()
  }, [router, supabase])

  const handleJobAdded = async () => {
    // Refresh jobs and stats
    const orgId = localStorage.getItem("organization_id")
    if (orgId) {
      const { data: jobsData } = await supabase
        .from("jobs")
        .select(
          `
          *,
          applications (
            id,
            status
          )
        `,
        )
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false })

      setJobs(jobsData || [])

      const activeJobsCount = (jobsData || []).filter((j: any) => j.status === "active").length
      setStats((prev) => ({
        ...prev,
        activeJobs: activeJobsCount,
      }))
    }
  }

  if (!isAuthenticated || isLoading) {
    return null
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      <OrgHeader organizationName={organizationName} organizationEmail={organizationEmail} />

      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#1A0D66" }}>
            Welcome, {organizationName}
          </h1>
          <p className="text-muted-foreground">Manage your job postings and review applications</p>
        </div>

        <OrgStats {...stats} />

        <div className="mt-8">
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="jobs">Job Postings</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Job Postings</CardTitle>
                      <CardDescription>Manage your organization's job postings</CardDescription>
                    </div>
                    <Button
                      onClick={() => setIsAddJobOpen(true)}
                      style={{ backgroundColor: "#C89333", color: "white" }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Post New Job
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <OrgJobsTable jobs={jobs} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Applications</CardTitle>
                  <CardDescription>Review and manage applications for your job postings</CardDescription>
                </CardHeader>
                <CardContent>
                  <OrgApplicationsTable applications={applications} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <OrgAddJobDialog isOpen={isAddJobOpen} onOpenChange={setIsAddJobOpen} onJobAdded={handleJobAdded} />
    </div>
  )
}
