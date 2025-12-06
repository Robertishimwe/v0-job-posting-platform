import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { AdminSystemStats } from "@/components/admin-system-stats"
import { AdminOrganizationsTable } from "@/components/admin-organizations-table"
import { AdminUsersTable } from "@/components/admin-users-table"
import { AdminAnalytics } from "@/components/admin-analytics"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

  // Fetch organizations with job and application counts
  const { data: organizations } = await supabase
    .from("organizations")
    .select("*")
    .order("created_at", { ascending: false })

  // Get job and application counts per organization
  const orgsWithCounts = await Promise.all(
    (organizations || []).map(async (org) => {
      const { count: jobsCount } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", org.id)

      const { data: orgJobs } = await supabase.from("jobs").select("id").eq("organization_id", org.id)

      let applicationsCount = 0
      if (orgJobs && orgJobs.length > 0) {
        const jobIds = orgJobs.map((j) => j.id)
        const { count } = await supabase
          .from("applications")
          .select("*", { count: "exact", head: true })
          .in("job_id", jobIds)
        applicationsCount = count || 0
      }

      return {
        ...org,
        jobs_count: jobsCount || 0,
        applications_count: applicationsCount,
      }
    }),
  )

  // Fetch users (job seekers) - using applications to get unique users
  const { data: applications } = await supabase
    .from("applications")
    .select("user_id, email, full_name, phone, created_at")
    .not("user_id", "is", null)

  // Deduplicate users by user_id
  const usersMap = new Map()
  applications?.forEach((app) => {
    if (app.user_id && !usersMap.has(app.user_id)) {
      usersMap.set(app.user_id, {
        id: app.user_id,
        email: app.email,
        full_name: app.full_name,
        phone: app.phone,
        status: "active",
        created_at: app.created_at,
      })
    }
  })

  // Get application counts per user
  const users = await Promise.all(
    Array.from(usersMap.values()).map(async (user) => {
      const { count } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
      return { ...user, applications_count: count || 0 }
    }),
  )

  // System Stats
  const { count: totalOrganizations } = await supabase.from("organizations").select("*", { count: "exact", head: true })

  const { count: activeOrganizations } = await supabase
    .from("organizations")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  const { count: totalJobs } = await supabase.from("jobs").select("*", { count: "exact", head: true })

  const { count: activeJobs } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  const { count: totalApplications } = await supabase.from("applications").select("*", { count: "exact", head: true })

  // Analytics Data
  // Applications by status
  const { data: allApplications } = await supabase.from("applications").select("status")
  const statusCounts = { pending: 0, shortlisted: 0, rejected: 0 }
  allApplications?.forEach((app) => {
    if (app.status in statusCounts) {
      statusCounts[app.status as keyof typeof statusCounts]++
    }
  })
  const applicationsByStatus = [
    { name: "Pending", value: statusCounts.pending },
    { name: "Shortlisted", value: statusCounts.shortlisted },
    { name: "Rejected", value: statusCounts.rejected },
  ]

  // Jobs by department
  const { data: allJobs } = await supabase.from("jobs").select("department")
  const deptCounts: Record<string, number> = {}
  allJobs?.forEach((job) => {
    if (job.department) {
      deptCounts[job.department] = (deptCounts[job.department] || 0) + 1
    }
  })
  const jobsByDepartment = Object.entries(deptCounts)
    .map(([department, count]) => ({ department, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  // Applications trend (last 6 months)
  const { data: trendData } = await supabase
    .from("applications")
    .select("applied_at")
    .order("applied_at", { ascending: true })

  const monthCounts: Record<string, number> = {}
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
    monthCounts[monthKey] = 0
  }
  trendData?.forEach((app) => {
    const date = new Date(app.applied_at)
    const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
    if (monthKey in monthCounts) {
      monthCounts[monthKey]++
    }
  })
  const applicationsTrend = Object.entries(monthCounts).map(([month, applications]) => ({
    month,
    applications,
  }))

  // Top organizations
  const topOrganizations = orgsWithCounts
    .sort((a, b) => b.applications_count - a.applications_count)
    .slice(0, 5)
    .map((org) => ({
      name: org.company_name.length > 15 ? org.company_name.slice(0, 15) + "..." : org.company_name,
      jobs: org.jobs_count,
      applications: org.applications_count,
    }))

  const analyticsData = {
    applicationsByStatus,
    jobsByDepartment,
    applicationsTrend,
    topOrganizations,
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      <AdminHeader user={adminData} />
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#1A0D66" }}>
            System Administration
          </h1>
          <p className="text-muted-foreground">Manage organizations, users, and view platform analytics</p>
        </div>

        <AdminSystemStats
          totalOrganizations={totalOrganizations || 0}
          activeOrganizations={activeOrganizations || 0}
          totalUsers={users.length}
          totalJobs={totalJobs || 0}
          activeJobs={activeJobs || 0}
          totalApplications={totalApplications || 0}
        />

        <div className="mt-8">
          <Tabs defaultValue="organizations" className="w-full">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="organizations" className="mt-6">
              <AdminOrganizationsTable organizations={orgsWithCounts} />
            </TabsContent>
            <TabsContent value="users" className="mt-6">
              <AdminUsersTable users={users} />
            </TabsContent>
            <TabsContent value="analytics" className="mt-6">
              <AdminAnalytics data={analyticsData} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
