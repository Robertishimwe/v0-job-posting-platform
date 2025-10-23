import { Building2 } from "lucide-react"

export function FeaturedCompanies() {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-balance" style={{ color: "#1A0D66" }}>
            Trusted by Leading Companies
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            We partner with top organizations across Rwanda to bring you the best career opportunities
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="w-full h-24 rounded-lg flex items-center justify-center bg-white border-2 hover:shadow-md transition-shadow"
              style={{ borderColor: "#E6A940" }}
            >
              <Building2 className="w-12 h-12 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
