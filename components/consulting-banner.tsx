import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

export function ConsultingBanner() {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block px-4 py-2 rounded-full mb-6" style={{ backgroundColor: "#1A0D66" }}>
          <span className="text-sm font-semibold" style={{ color: "#E6A940" }}>
            OUR CONSULTING SERVICES
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance" style={{ color: "#1A0D66" }}>
          Need Financial Consulting?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
          Beyond recruitment, we offer comprehensive financial consulting services to help businesses thrive. From
          strategic planning to financial analysis, we're here to elevate your business.
        </p>
        <Link href="https://blob.v0.app/p04OB.html" target="_blank">
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 border-2 bg-transparent"
            style={{ borderColor: "#C89333", color: "#1A0D66" }}
          >
            Visit Our Consulting Website
            <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
