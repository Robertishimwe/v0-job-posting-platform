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

export default function OrganizationLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Query organizations table to verify credentials
      const { data: orgData, error: queryError } = await supabase
        .from("organizations")
        .select("*")
        .eq("email", email)
        .single()

      if (queryError || !orgData) {
        throw new Error("Invalid email or password")
      }

      // In production, compare hashed passwords
      if (orgData.password_hash !== password) {
        throw new Error("Invalid email or password")
      }

      // Store organization ID in session/localStorage for now
      localStorage.setItem("organization_id", orgData.id)
      localStorage.setItem("organization_email", orgData.email)
      localStorage.setItem("user_type", "organization")

      router.push("/organization/dashboard")
      router.refresh()
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
                Organization Log In
              </CardTitle>
              <CardDescription>Enter your credentials to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="organization@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={isLoading}
                    style={{ backgroundColor: "#C89333", color: "white" }}
                  >
                    {isLoading ? "Logging in..." : "Log In"}
                  </Button>
                  <p className="text-sm text-center mt-4">
                    Don't have an account?{" "}
                    <Link href="/organization/signup" style={{ color: "#C89333" }}>
                      Sign Up
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
