import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Briefcase, FileText, LogOut, Building2 } from "lucide-react"
import Link from "next/link"

export default async function MyApplicationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: applications, error } = await supabase
    .from("applications")
    .select(
      `
      *,
      jobs (
        id,
        title,
        location,
        department,
        type,
        posted_date,
        organizations (
          id,
          company_name
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching applications:", error)
  }

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#1A0D66" }}>
              My Applications
            </h1>
            <p className="text-muted-foreground mt-2">Track the status of your job applications</p>
          </div>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href="/">Browse Jobs</Link>
            </Button>
            <form action={handleSignOut}>
              <Button type="submit" variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>

        {!applications || applications.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4 py-8">
                <Briefcase className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-semibold" style={{ color: "#1A0D66" }}>
                  No Applications Yet
                </h3>
                <p className="text-muted-foreground">
                  You haven't applied to any jobs yet. Start browsing available positions!
                </p>
                <Button asChild style={{ backgroundColor: "#C89333", color: "white" }}>
                  <Link href="/">Browse Jobs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {applications.map((application: any) => (
              <Card key={application.id} style={{ borderColor: "#E6A940" }}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle style={{ color: "#1A0D66" }}>{application.jobs?.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm flex-wrap">
                        {application.jobs?.organizations?.company_name && (
                          <span className="flex items-center gap-1 font-medium" style={{ color: "#C89333" }}>
                            <Building2 className="h-4 w-4" />
                            {application.jobs.organizations.company_name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {application.jobs?.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {application.jobs?.location}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        application.status === "shortlisted"
                          ? "default"
                          : application.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                      style={
                        application.status === "shortlisted"
                          ? { backgroundColor: "#C89333", color: "white" }
                          : undefined
                      }
                    >
                      {application.status === "pending"
                        ? "Under Review"
                        : application.status === "shortlisted"
                          ? "Shortlisted"
                          : "Not Selected"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Applied {new Date(application.created_at).toLocaleDateString()}
                    </span>
                    {application.resume_url && (
                      <a
                        href={application.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:underline"
                        style={{ color: "#C89333" }}
                      >
                        <FileText className="h-4 w-4" />
                        View Resume
                      </a>
                    )}
                  </div>
                  {application.cover_letter && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2" style={{ color: "#1A0D66" }}>
                        Cover Letter
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-3">{application.cover_letter}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
