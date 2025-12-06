import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export async function Footer() {
  const supabase = await createClient()

  // Fetch site settings
  const { data: settings } = await supabase.from("site_settings").select("key, value")

  // Convert to object for easy access
  const siteSettings: Record<string, string> = {}
  settings?.forEach((s) => {
    siteSettings[s.key] = s.value
  })

  // Use settings or fallback to defaults
  const contactEmail = siteSettings.contact_email || "info@elevatefinconsult.com"
  const contactPhone = siteSettings.contact_phone || "+250 XXX XXX XXX"
  const contactLocation = siteSettings.contact_location || "Kigali, Rwanda"
  const consultingUrl = siteSettings.consulting_website_url || "https://www.elevatefinconsult.com"

  return (
    <footer className="border-t" style={{ backgroundColor: "#1A0D66", borderColor: "#0F0A4A" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/untitled-design-removebg-preview.png"
                alt="Elevate Fin Consult Logo"
                width={50}
                height={50}
                className="object-contain"
              />
              <span className="text-lg font-bold text-white">Elevate Fin Consult</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Rwanda's leading financial consulting firm, dedicated to driving excellence and transformation.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                  style={{ color: "#E6A940" }}
                >
                  Job Opportunities
                </Link>
              </li>
              <li>
                <Link href={consultingUrl} target="_blank" className="text-gray-300 hover:text-white transition-colors">
                  Consulting Services
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-gray-300 hover:text-white transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-300">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#E6A940" }} />
                <span>{contactLocation}</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: "#E6A940" }} />
                <span>{contactPhone}</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="h-4 w-4 flex-shrink-0" style={{ color: "#E6A940" }} />
                <span>{contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-400" style={{ borderColor: "#0F0A4A" }}>
          <p>&copy; {new Date().getFullYear()} Elevate Fin Consult. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
