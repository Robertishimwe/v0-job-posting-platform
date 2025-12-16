import { createClient } from "@/lib/supabase/server"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = "https://www.elevatefinconsult.com"

  // Fetch all active jobs
  const { data: jobs } = await supabase.from("jobs").select("id, posted_date").eq("status", "active")

  const jobUrls =
    jobs?.map((job) => ({
      url: `${baseUrl}/jobs/${job.id}`,
      lastModified: new Date(job.posted_date),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...jobUrls,
  ]
}
