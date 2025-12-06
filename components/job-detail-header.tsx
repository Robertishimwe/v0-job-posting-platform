"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Briefcase, Calendar, DollarSign, Building2 } from "lucide-react"
import type { Job } from "@/lib/types"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface JobDetailHeaderProps {
  job: Job & { organizations?: { id: string; company_name: string } }
}

export function JobDetailHeader({ job }: JobDetailHeaderProps) {
  const router = useRouter()
  const postedDate = new Date(job.posted_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <header className="border-b" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/")} style={{ color: "#1A0D66" }}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>

        <div className="flex items-start gap-6">
          <Image
            src="/images/untitled-design-removebg-preview.png"
            alt="Logo"
            width={80}
            height={80}
            className="object-contain hidden md:block"
          />
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" style={{ backgroundColor: "#1A0D66", color: "white" }}>
                {job.department}
              </Badge>
              <Badge variant="outline" style={{ borderColor: "#C89333", color: "#C89333" }}>
                {job.type}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance" style={{ color: "#1A0D66" }}>
              {job.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {job.organizations?.company_name && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" style={{ color: "#C89333" }} />
                  <span className="font-medium">{job.organizations.company_name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" style={{ color: "#C89333" }} />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" style={{ color: "#C89333" }} />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" style={{ color: "#C89333" }} />
                <span>Posted {postedDate}</span>
              </div>
              {job.salary_range && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" style={{ color: "#C89333" }} />
                  <span>{job.salary_range}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
