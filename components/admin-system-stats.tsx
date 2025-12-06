import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Briefcase, FileText } from "lucide-react"

interface AdminSystemStatsProps {
  totalOrganizations: number
  activeOrganizations: number
  totalUsers: number
  totalJobs: number
  activeJobs: number
  totalApplications: number
}

export function AdminSystemStats({
  totalOrganizations,
  activeOrganizations,
  totalUsers,
  totalJobs,
  activeJobs,
  totalApplications,
}: AdminSystemStatsProps) {
  const stats = [
    {
      title: "Total Organizations",
      value: totalOrganizations,
      subtext: `${activeOrganizations} active`,
      icon: Building2,
      color: "#1A0D66",
      borderColor: "#1A0D66",
    },
    {
      title: "Total Users",
      value: totalUsers,
      subtext: "Job seekers",
      icon: Users,
      color: "#3B82F6",
      borderColor: "#3B82F6",
    },
    {
      title: "Total Jobs Posted",
      value: totalJobs,
      subtext: `${activeJobs} active`,
      icon: Briefcase,
      color: "#C89333",
      borderColor: "#C89333",
    },
    {
      title: "Total Applications",
      value: totalApplications,
      subtext: "All time",
      icon: FileText,
      color: "#10B981",
      borderColor: "#10B981",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="border-l-4" style={{ borderLeftColor: stat.borderColor }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className="h-5 w-5" style={{ color: stat.color }} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
