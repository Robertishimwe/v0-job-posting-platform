import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { ApplicationsTable } from "@/components/applications-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobsManagementTable } from "@/components/jobs-management-table"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Check if user is admin
  const { data: adminData } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

  if (!adminData) {
    redirect("/admin/login")
  }

  // Fetch applications with job details
  const { data: applications } = await supabase
    .from("applications")
    .select(
      `
      *,
      jobs (
        title,
        department,
        type
      )
    `,
    )
    .order("applied_at", { ascending: false })

  const { data: jobs } = await supabase.from("jobs").select("*").order("created_at", { ascending: false })

  // Fetch stats
  const { count: totalApplications } = await supabase.from("applications").select("*", { count: "exact", head: true })

  const { count: pendingApplications } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: shortlistedApplications } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "shortlisted")

  const { count: activeJobs } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      <AdminHeader user={adminData} />
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#1A0D66" }}>
            Dashboard
          </h1>
          <p className="text-muted-foreground">Manage job applications and track recruitment progress</p>
        </div>

        <DashboardStats
          totalApplications={totalApplications || 0}
          pendingApplications={pendingApplications || 0}
          shortlistedApplications={shortlistedApplications || 0}
          activeJobs={activeJobs || 0}
        />

        <div className="mt-8">
          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
            </TabsList>
            <TabsContent value="applications" className="mt-6">
              <ApplicationsTable applications={applications || []} />
            </TabsContent>
            <TabsContent value="jobs" className="mt-6">
              <JobsManagementTable jobs={jobs || []} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
