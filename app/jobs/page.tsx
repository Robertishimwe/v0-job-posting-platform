import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { JobsBrowser } from "@/components/jobs-browser"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Browse All Jobs | Elevate Fin Consult",
  description:
    "Explore career opportunities from top companies in Rwanda. Find your next job in finance, consulting, technology, and more through Elevate Fin Consult.",
  keywords: [
    "jobs in Rwanda",
    "Kigali jobs",
    "career opportunities",
    "finance jobs",
    "consulting jobs",
    "technology jobs",
    "Rwanda employment",
  ],
  openGraph: {
    title: "Browse All Jobs | Elevate Fin Consult",
    description:
      "Explore career opportunities from top companies in Rwanda. Find your next job in finance, consulting, technology, and more.",
    url: "https://www.elevatefinconsult.com/jobs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse All Jobs | Elevate Fin Consult",
    description:
      "Explore career opportunities from top companies in Rwanda. Find your next job in finance, consulting, technology, and more.",
  },
  alternates: {
    canonical: "https://www.elevatefinconsult.com/jobs",
  },
}

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
      <main className="flex-1 py-12 px-4 md:px-8 lg:px-12 w-full">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-balance" style={{ color: "#1A0D66" }}>
              Browse All Jobs
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Find your next career opportunity from our partner companies
            </p>
          </div>
          <JobsBrowser jobs={jobs || []} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
