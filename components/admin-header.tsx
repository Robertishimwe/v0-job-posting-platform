"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LogOut, Home } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface AdminHeaderProps {
  user: {
    email: string
    full_name?: string | null
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <header className="border-b" style={{ backgroundColor: "#1A0D66", borderColor: "#0F0A4A" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled_design-removebg-preview-9H5aRQRAIuCGh47RZNcYBRSMyOTojv.png"
              alt="Elevate Fin Consult Logo"
              width={50}
              height={50}
              className="object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-300">{user.full_name || user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <Home className="mr-2 h-4 w-4" />
                View Site
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-white hover:bg-white/10"
              style={{ color: "#E6A940" }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
