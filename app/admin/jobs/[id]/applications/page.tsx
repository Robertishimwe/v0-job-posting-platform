import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { ApplicationsTable } from "@/components/applications-table"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function JobApplicationsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: adminData } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

  if (!adminData) {
    redirect("/admin/login")
  }

  const { data: job } = await supabase.from("jobs").select("*").eq("id", params.id).single()

  if (!job) {
    notFound()
  }

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
    .eq("job_id", params.id)
    .order("applied_at", { ascending: false })

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      <AdminHeader user={adminData} />
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#1A0D66" }}>
            Applications for {job.title}
          </h1>
          <p className="text-muted-foreground">
            {job.department} • {job.location} • {job.type}
          </p>
        </div>

        <ApplicationsTable applications={applications || []} />
      </main>
    </div>
  )
}
