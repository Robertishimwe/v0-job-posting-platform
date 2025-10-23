import { Search, FileText, CheckCircle } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Browse Opportunities",
      description:
        "Explore jobs from leading companies across various industries and find roles that match your skills and aspirations.",
    },
    {
      icon: FileText,
      title: "Submit Application",
      description:
        "Apply directly through our platform with your resume and cover letter. Your application goes straight to the hiring team.",
    },
    {
      icon: CheckCircle,
      title: "Get Hired",
      description:
        "Companies review applications and reach out to qualified candidates. We facilitate the entire hiring process.",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance" style={{ color: "#1A0D66" }}>
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Finding your dream job is simple with our streamlined process
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: "#1A0D66" }}
                >
                  <step.icon className="w-8 h-8" style={{ color: "#E6A940" }} />
                </div>
                <div
                  className="absolute top-8 left-1/2 w-full h-0.5 hidden md:block"
                  style={{
                    backgroundColor: index < steps.length - 1 ? "#E6A940" : "transparent",
                    transform: "translateX(50%)",
                  }}
                />
                <h3 className="text-xl font-bold mb-3" style={{ color: "#1A0D66" }}>
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-pretty leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
