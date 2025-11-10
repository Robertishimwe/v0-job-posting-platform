"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function OrganizationSignupPage() {
  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // For now, we'll use a simple approach - store in organizations table
      // In a real app, you'd want to use proper authentication
      const { data, error: insertError } = await supabase
        .from("organizations")
        .insert([
          {
            company_name: formData.company_name,
            contact_person: formData.contact_person,
            email: formData.email,
            password_hash: formData.password, // In production, hash this!
          },
        ])
        .select()

      if (insertError) throw insertError

      alert("Organization registered successfully! Please log in.")
      router.push("/organization/login")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex justify-center mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled_design-removebg-preview-9H5aRQRAIuCGh47RZNcYBRSMyOTojv.png"
              alt="Elevate Fin Consult Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <Card style={{ borderColor: "#E6A940" }}>
            <CardHeader>
              <CardTitle className="text-2xl" style={{ color: "#1A0D66" }}>
                Organization Sign Up
              </CardTitle>
              <CardDescription>Register your organization to post jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input
                      id="contact_person"
                      name="contact_person"
                      value={formData.contact_person}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={isLoading}
                    style={{ backgroundColor: "#C89333", color: "white" }}
                  >
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </Button>
                  <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <Link href="/organization/login" style={{ color: "#C89333" }}>
                      Log In
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
