import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { JobDetailHeader } from "@/components/job-detail-header"
import { JobDetailContent } from "@/components/job-detail-content"
import { ApplicationForm } from "@/components/application-form"
import { Footer } from "@/components/footer"

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: job, error } = await supabase
    .from("jobs")
    .select(
      `
      *,
      organizations (
        id,
        company_name
      )
    `,
    )
    .eq("id", id)
    .eq("status", "active")
    .single()

  if (error || !job) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <JobDetailHeader job={job} />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <JobDetailContent job={job} />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ApplicationForm jobId={job.id} jobTitle={job.title} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
