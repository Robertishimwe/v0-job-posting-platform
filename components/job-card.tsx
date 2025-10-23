import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, Calendar, ArrowRight } from "lucide-react"
import type { Job } from "@/lib/types"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const postedDate = new Date(job.posted_date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow" style={{ borderColor: "#E6A940" }}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary" style={{ backgroundColor: "#F8F9FA", color: "#1A0D66" }}>
            {job.department}
          </Badge>
          <Badge variant="outline" style={{ borderColor: "#C89333", color: "#C89333" }}>
            {job.type}
          </Badge>
        </div>
        <CardTitle className="text-xl" style={{ color: "#1A0D66" }}>
          {job.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">{job.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
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
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/jobs/${job.id}`} className="w-full">
          <Button className="w-full" style={{ backgroundColor: "#C89333", color: "white" }}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
