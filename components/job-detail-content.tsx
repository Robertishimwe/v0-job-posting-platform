import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Job } from "@/lib/types"

interface JobDetailContentProps {
  job: Job
}

export function JobDetailContent({ job }: JobDetailContentProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle style={{ color: "#1A0D66" }}>About the Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-sm max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: job.description || "" }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle style={{ color: "#1A0D66" }}>Key Responsibilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-sm max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: job.responsibilities || "" }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle style={{ color: "#1A0D66" }}>Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-sm max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: job.requirements || "" }}
          />
        </CardContent>
      </Card>

      {job.deadline && (
        <Card style={{ borderColor: "#E6A940", backgroundColor: "#FFF9F0" }}>
          <CardContent className="pt-6">
            <p className="text-sm font-medium" style={{ color: "#1A0D66" }}>
              Application Deadline:{" "}
              <span style={{ color: "#C89333" }}>
                {new Date(job.deadline).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
