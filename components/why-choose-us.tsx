import { Shield, Users, Zap, Award } from "lucide-react"

export function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "Verified Companies",
      description: "All our partner companies are thoroughly vetted to ensure legitimate opportunities.",
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Our team provides guidance throughout your job search and application process.",
    },
    {
      icon: Zap,
      title: "Quick Process",
      description: "Streamlined application system gets your profile to employers faster.",
    },
    {
      icon: Award,
      title: "Quality Opportunities",
      description: "We curate positions from top companies across various industries.",
    },
  ]

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance" style={{ color: "#1A0D66" }}>
            Why Choose Our Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            We're committed to connecting talented professionals with their ideal career opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: "#1A0D66" }}
              >
                <feature.icon className="w-8 h-8" style={{ color: "#E6A940" }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "#1A0D66" }}>
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-pretty leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
