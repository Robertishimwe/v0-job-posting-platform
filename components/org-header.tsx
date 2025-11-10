"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, Home } from "lucide-react"
import { useRouter } from "next/navigation"

export function OrgHeader({
  organizationName,
  organizationEmail,
}: { organizationName: string; organizationEmail: string }) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("organization_id")
    localStorage.removeItem("organization_email")
    localStorage.removeItem("organization_name")
    localStorage.removeItem("user_type")
    router.push("/")
  }

  return (
    <header style={{ backgroundColor: "#1A0D66" }} className="border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/organization/dashboard" className="flex items-center gap-3">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled_design-removebg-preview-9H5aRQRAIuCGh47RZNcYBRSMyOTojv.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">Organization Dashboard</span>
              <span className="text-xs" style={{ color: "#C89333" }}>
                {organizationName}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="text-white hover:text-[#C89333]">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                View Site
              </Link>
            </Button>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-white hover:text-[#C89333]">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
