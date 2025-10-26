import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { JobsBrowser } from "@/components/jobs-browser"

export default async function JobsPage() {
  const supabase = await createClient()

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "active")
    .order("posted_date", { ascending: false })

  if (error) {
    console.error("Error fetching jobs:", error)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-balance" style={{ color: "#1A0D66" }}>
            Browse All Jobs
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Find your next career opportunity from our partner companies
          </p>
        </div>
        <JobsBrowser jobs={jobs || []} />
      </main>
      <Footer />
    </div>
  )
}
