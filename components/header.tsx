"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, User } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isOrganization, setIsOrganization] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setIsSignedIn(!!user)

      if (user) {
        try {
          const { data: adminData, error: adminError } = await supabase
            .from("admin_users")
            .select("*")
            .eq("id", user.id)
            .maybeSingle()
          setIsAdmin(!!adminData && !adminError)
        } catch {
          setIsAdmin(false)
        }

        try {
          const { data: orgData, error: orgError } = await supabase
            .from("organizations")
            .select("*")
            .eq("id", user.id)
            .maybeSingle()
          setIsOrganization(!!orgData && !orgError)
        } catch {
          setIsOrganization(false)
        }
      }
    }
    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsSignedIn(!!session)
      if (session?.user) {
        try {
          const { data: adminData, error: adminError } = await supabase
            .from("admin_users")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle()
          setIsAdmin(!!adminData && !adminError)
        } catch {
          setIsAdmin(false)
        }

        try {
          const { data: orgData, error: orgError } = await supabase
            .from("organizations")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle()
          setIsOrganization(!!orgData && !orgError)
        } catch {
          setIsOrganization(false)
        }
      } else {
        setIsAdmin(false)
        setIsOrganization(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled_design-removebg-preview-9H5aRQRAIuCGh47RZNcYBRSMyOTojv.png"
              alt="Elevate Fin Consult Logo"
              width={50}
              height={50}
              className="object-contain"
              priority
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight" style={{ color: "#1A0D66" }}>
                ELEVATE FIN CONSULT
              </span>
              <span className="text-xs font-medium" style={{ color: "#C89333" }}>
                Expertise in Every Decision
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#opportunities"
              className="text-sm font-medium transition-colors hover:text-[#C89333]"
              style={{ color: "#1A0D66" }}
            >
              Browse Jobs
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium transition-colors hover:text-[#C89333]"
              style={{ color: "#1A0D66" }}
            >
              How It Works
            </Link>
            <Link
              href="/#companies"
              className="text-sm font-medium transition-colors hover:text-[#C89333]"
              style={{ color: "#1A0D66" }}
            >
              Companies
            </Link>
            <Link
              href="https://elevatefinconsult.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors hover:text-[#C89333]"
              style={{ color: "#1A0D66" }}
            >
              Consulting Services
            </Link>
            {isSignedIn ? (
              <Button asChild size="sm" className="ml-4" style={{ backgroundColor: "#C89333", color: "white" }}>
                <Link
                  href={isAdmin ? "/admin/dashboard" : isOrganization ? "/organization/dashboard" : "/my-applications"}
                >
                  <User className="mr-2 h-4 w-4" />
                  My Account
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm" style={{ backgroundColor: "#C89333", color: "white" }}>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <Menu className="h-6 w-6" style={{ color: "#1A0D66" }} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link
                href="/#opportunities"
                className="text-sm font-medium transition-colors hover:text-[#C89333]"
                style={{ color: "#1A0D66" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Jobs
              </Link>
              <Link
                href="/#how-it-works"
                className="text-sm font-medium transition-colors hover:text-[#C89333]"
                style={{ color: "#1A0D66" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/#companies"
                className="text-sm font-medium transition-colors hover:text-[#C89333]"
                style={{ color: "#1A0D66" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Companies
              </Link>
              <Link
                href="https://elevatefinconsult.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium transition-colors hover:text-[#C89333]"
                style={{ color: "#1A0D66" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Consulting Services
              </Link>
              {isSignedIn ? (
                <Button asChild size="sm" className="w-full" style={{ backgroundColor: "#C89333", color: "white" }}>
                  <Link
                    href={
                      isAdmin ? "/admin/dashboard" : isOrganization ? "/organization/dashboard" : "/my-applications"
                    }
                  >
                    <User className="mr-2 h-4 w-4" />
                    My Account
                  </Link>
                </Button>
              ) : (
                <Button asChild size="sm" className="w-full" style={{ backgroundColor: "#C89333", color: "white" }}>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
