import { createClient } from "@/lib/supabase/server"
import type { Job } from "@/lib/types"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { WhyChooseUs } from "@/components/why-choose-us"
import { FeaturedCompanies } from "@/components/featured-companies"
import { JobCard } from "@/components/job-card"
import { ConsultingBanner } from "@/components/consulting-banner"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Elevate Fin Consult | Rwanda's Leading Career Portal for Financial Services",
  description:
    "Rwanda's premier job portal connecting top talent with leading financial consulting firms. Find your next career opportunity with Elevate Fin Consult in Kigali and beyond.",
  keywords: [
    "Rwanda jobs",
    "Kigali careers",
    "financial consulting",
    "job opportunities Rwanda",
    "Elevate Fin Consult",
    "career portal",
    "employment Rwanda",
    "recruitment services",
    "job search Rwanda",
    "Kigali jobs",
  ],
  openGraph: {
    title: "Elevate Fin Consult | Rwanda's Leading Career Portal",
    description:
      "Rwanda's premier job portal connecting top talent with leading financial consulting firms. Find your next career opportunity.",
    url: "https://www.elevatefinconsult.com",
    siteName: "Elevate Fin Consult Careers",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/api/og?title=Find Your Next Career Opportunity&company=Elevate Fin Consult&location=Kigali, Rwanda&type=",
        width: 1200,
        height: 630,
        alt: "Elevate Fin Consult - Career Opportunities in Rwanda",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elevate Fin Consult | Rwanda's Leading Career Portal",
    description:
      "Rwanda's premier job portal connecting top talent with leading financial consulting firms. Find your next career opportunity.",
    images: [
      "/api/og?title=Find Your Next Career Opportunity&company=Elevate Fin Consult&location=Kigali, Rwanda&type=",
    ],
    site: "@elevatefinconsult",
  },
  alternates: {
    canonical: "https://www.elevatefinconsult.com",
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

export default async function HomePage() {
  const supabase = await createClient()

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "active")
    .order("posted_date", { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching jobs:", error)
  }

  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Elevate Fin Consult",
    alternateName: "Elevate Financial Consulting",
    url: "https://www.elevatefinconsult.com",
    logo: "https://www.elevatefinconsult.com/images/untitled-design-removebg-preview.png",
    description:
      "Rwanda's leading financial consulting firm, dedicated to driving excellence and transformation through expert career placement and consulting services.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kigali",
      addressCountry: "RW",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "info@elevatefinconsult.com",
      availableLanguage: ["English", "Kinyarwanda", "French"],
    },
    sameAs: [
      "https://www.linkedin.com/company/elevatefinconsult",
      "https://twitter.com/elevatefinconsult",
      "https://www.facebook.com/elevatefinconsult",
    ],
  }

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Elevate Fin Consult Careers",
    url: "https://www.elevatefinconsult.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.elevatefinconsult.com/jobs?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }} />

      <div className="min-h-screen flex flex-col">
        <Header />
        <Hero />
        <main className="flex-1">
          <HowItWorks />
          <WhyChooseUs />
          <FeaturedCompanies />

          <section id="opportunities" className="py-20 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance" style={{ color: "#1A0D66" }}>
                Current Opportunities
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Explore the latest job openings from our partner companies across various industries
              </p>
            </div>

            {jobs && jobs.length > 0 ? (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {jobs.map((job: Job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
                <div className="mt-12 text-center">
                  <Button asChild size="lg" style={{ backgroundColor: "#C89333", color: "white" }}>
                    <Link href="/jobs">
                      View All Jobs
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No open positions at the moment. Check back soon!</p>
              </div>
            )}
          </section>

          <ConsultingBanner />
        </main>
        <Footer />
      </div>
    </>
  )
}
