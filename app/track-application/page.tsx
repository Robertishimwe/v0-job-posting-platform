"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, Calendar, Briefcase, MapPin, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Application = {
  id: string
  full_name: string
  email: string
  phone: string
  status: string
  applied_at: string
  jobs: {
    title: string
    department: string
    location: string
    type: string
  }
}

export default function TrackApplicationPage() {
  const [email, setEmail] = useState("")
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSearched(true)

    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from("applications")
        .select(
          `
          *,
          jobs (
            title,
            department,
            location,
            type
          )
        `,
        )
        .eq("email", email)
        .order("applied_at", { ascending: false })

      if (fetchError) throw fetchError

      setApplications(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch applications")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "shortlisted":
        return "bg-green-100 text-green-800 border-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Under Review"
      case "shortlisted":
        return "Shortlisted"
      case "rejected":
        return "Not Selected"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8F9FA" }}>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3" style={{ color: "#1A0D66" }}>
            Track Your Application
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your email address to view the status of your job applications
          </p>
        </div>

        <Card className="mb-8" style={{ borderColor: "#E6A940" }}>
          <CardHeader>
            <CardTitle style={{ color: "#1A0D66" }}>Search Applications</CardTitle>
            <CardDescription>Enter the email address you used when applying</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="email" className="sr-only">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="gap-2"
                style={{ backgroundColor: "#C89333", color: "white" }}
              >
                <Search className="h-4 w-4" />
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </form>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </CardContent>
        </Card>

        {searched && applications.length === 0 && !isLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No applications found for this email address.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Make sure you entered the correct email address you used when applying.
              </p>
            </CardContent>
          </Card>
        )}

        {applications.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: "#1A0D66" }}>
              Your Applications ({applications.length})
            </h2>
            {applications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold mb-1" style={{ color: "#1A0D66" }}>
                            {application.jobs.title}
                          </h3>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {application.jobs.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {application.jobs.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {application.jobs.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Applied on {new Date(application.applied_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(application.status)} px-4 py-2 text-sm font-medium`}>
                      {getStatusText(application.status)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
