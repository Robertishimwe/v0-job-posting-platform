import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { JobDetailHeader } from "@/components/job-detail-header"
import { JobDetailContent } from "@/components/job-detail-content"
import { ApplicationForm } from "@/components/application-form"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: job } = await supabase
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

  if (!job) {
    return {
      title: "Job Not Found",
    }
  }

  const companyName = job.organizations?.company_name || "Elevate Fin Consult"
  const jobTitle = job.title
  const description =
    job.description?.substring(0, 155) ||
    `${jobTitle} position at ${companyName}. ${job.type} role in ${job.location}. Apply now!`
  const url = `https://www.elevatefinconsult.com/jobs/${id}`

  const ogImageUrl = `/api/og?title=${encodeURIComponent(jobTitle)}&company=${encodeURIComponent(companyName)}&location=${encodeURIComponent(job.location)}&type=${encodeURIComponent(job.type)}`

  return {
    title: `${jobTitle} at ${companyName} | Elevate Fin Consult`,
    description,
    keywords: [
      jobTitle,
      companyName,
      job.department,
      job.location,
      job.type,
      "job opening",
      "career opportunity",
      "Rwanda jobs",
      "Kigali jobs",
      "financial consulting",
      "recruitment",
    ],
    authors: [{ name: "Elevate Fin Consult" }],
    creator: "Elevate Fin Consult",
    publisher: "Elevate Fin Consult",
    openGraph: {
      title: `${jobTitle} at ${companyName}`,
      description,
      url,
      siteName: "Elevate Fin Consult Careers",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${jobTitle} at ${companyName} - ${job.location}`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${jobTitle} at ${companyName}`,
      description,
      images: [ogImageUrl],
      site: "@elevatefinconsult",
      creator: "@elevatefinconsult",
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.posted_date,
    validThrough: job.deadline,
    employmentType: job.type?.toUpperCase().replace("-", "_") || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.organizations?.company_name || "Elevate Fin Consult",
      sameAs: "https://www.elevatefinconsult.com",
      logo: "https://www.elevatefinconsult.com/logo.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: "KN 67 St",
        addressLocality: job.location || "Kigali",
        addressRegion: "Kigali",
        postalCode: "00000",
        addressCountry: "RW",
      },
    },
    ...(job.salary_range && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "RWF",
        value: {
          "@type": "QuantitativeValue",
          minValue: job.salary_range.split("-")[0]?.trim() || job.salary_range,
          maxValue: job.salary_range.split("-")[1]?.trim() || job.salary_range,
          unitText: "YEAR",
        },
      },
    }),
    jobBenefits: job.responsibilities
      ? [
          {
            "@type": "Thing",
            name: "Professional growth opportunities",
          },
        ]
      : undefined,
    skills: job.requirements
      ? job.requirements.split("\n").map((req: string) => ({
          "@type": "Thing",
          name: req.trim(),
        }))
      : undefined,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
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
    </>
  )
}
