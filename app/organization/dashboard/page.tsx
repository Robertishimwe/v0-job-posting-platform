"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut } from "lucide-react"

export default function OrganizationDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const router = useRouter()

  useEffect(() => {
    const orgId = localStorage.getItem("organization_id")
    const company = localStorage.getItem("organization_email")

    if (!orgId) {
      router.push("/organization/login")
    } else {
      setIsAuthenticated(true)
      setCompanyName(company || "Organization")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("organization_id")
    localStorage.removeItem("organization_email")
    localStorage.removeItem("user_type")
    router.push("/")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: "#1A0D66" }}>
            Organization Dashboard
          </h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: "#1A0D66" }}>
            Welcome, {companyName}
          </h2>
          <p className="text-muted-foreground">Manage your job postings and review applications</p>
        </div>

        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="jobs">My Job Postings</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Job Postings</CardTitle>
                    <CardDescription>Manage your organization's job postings</CardDescription>
                  </div>
                  <Button style={{ backgroundColor: "#C89333", color: "white" }}>Post a New Job</Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Job posting management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Applications</CardTitle>
                <CardDescription>Review and manage applications for your job postings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Application management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
