import { Card, CardContent } from "@/components/ui/card"
import { Users, Briefcase, CheckCircle2, Clock } from "lucide-react"

interface OrgStatsProps {
  activeJobs: number
  totalApplications: number
  shortlistedApplications: number
  pendingApplications: number
}

export function OrgStats({
  activeJobs,
  totalApplications,
  shortlistedApplications,
  pendingApplications,
}: OrgStatsProps) {
  const stats = [
    {
      label: "Active Jobs",
      value: activeJobs,
      icon: Briefcase,
      color: "#C89333",
    },
    {
      label: "Total Applications",
      value: totalApplications,
      icon: Users,
      color: "#6366F1",
    },
    {
      label: "Shortlisted",
      value: shortlistedApplications,
      icon: CheckCircle2,
      color: "#10B981",
    },
    {
      label: "Pending Review",
      value: pendingApplications,
      icon: Clock,
      color: "#F59E0B",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="border-l-4" style={{ borderLeftColor: stat.color }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-2" style={{ color: "#1A0D66" }}>
                    {stat.value}
                  </p>
                </div>
                <Icon className="h-8 w-8" style={{ color: stat.color }} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
