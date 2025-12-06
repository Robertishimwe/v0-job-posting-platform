import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
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
                <Link
                  href="https://blob.v0.app/p04OB.html"
                  target="_blank"
                  className="text-gray-300 hover:text-white transition-colors"
                >
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
                <span>Kigali, Rwanda</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: "#E6A940" }} />
                <span>+250 XXX XXX XXX</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="h-4 w-4 flex-shrink-0" style={{ color: "#E6A940" }} />
                <span>careers@elevatefinconsult.com</span>
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
