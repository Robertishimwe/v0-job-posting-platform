import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, CheckCircle2, Briefcase } from "lucide-react"

interface DashboardStatsProps {
  totalApplications: number
  pendingApplications: number
  shortlistedApplications: number
  activeJobs: number
}

export function DashboardStats({
  totalApplications,
  pendingApplications,
  shortlistedApplications,
  activeJobs,
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Applications",
      value: totalApplications,
      icon: Users,
      color: "#1A0D66",
    },
    {
      title: "Pending Review",
      value: pendingApplications,
      icon: Clock,
      color: "#C89333",
    },
    {
      title: "Shortlisted",
      value: shortlistedApplications,
      icon: CheckCircle2,
      color: "#10B981",
    },
    {
      title: "Active Jobs",
      value: activeJobs,
      icon: Briefcase,
      color: "#E6A940",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className="h-4 w-4" style={{ color: stat.color }} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
