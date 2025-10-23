"use client"

import { Button } from "@/components/ui/button"
import { Search, Briefcase, Users, TrendingUp } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#1A0D66] via-[#0F0A4A] to-[#1A0D66]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative flex-1 flex items-center max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-white space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <TrendingUp className="h-4 w-4" style={{ color: "#E6A940" }} />
              <span className="text-sm font-medium">Rwanda's Leading Job Platform</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
              Find Your Dream Career{" "}
              <span className="relative">
                <span style={{ color: "#E6A940" }}>Opportunity</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 5.5C50 1.5 150 1.5 199 5.5" stroke="#E6A940" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 text-pretty leading-relaxed max-w-xl">
              Connect with top employers across Rwanda and beyond. We partner with leading companies to bring you
              exceptional career opportunities in finance, technology, consulting, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="text-base px-8 h-12 shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: "#C89333", color: "white" }}
                onClick={() => {
                  document.getElementById("opportunities")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                <Search className="mr-2 h-5 w-5" />
                Explore Opportunities
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-12 border-2 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all"
                style={{ borderColor: "#E6A940", color: "white" }}
                onClick={() => {
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: "#E6A940" }}>
                  200+
                </div>
                <div className="text-sm text-gray-300">Active Jobs</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: "#E6A940" }}>
                  50+
                </div>
                <div className="text-sm text-gray-300">Companies</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: "#E6A940" }}>
                  1000+
                </div>
                <div className="text-sm text-gray-300">Placements</div>
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#C89333" }}
                >
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Quality Jobs</h3>
                <p className="text-sm text-gray-300">
                  Curated opportunities from verified employers across multiple industries
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all mt-8">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#C89333" }}
                >
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Expert Support</h3>
                <p className="text-sm text-gray-300">Professional guidance throughout your job search journey</p>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#C89333" }}
                >
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Fast Process</h3>
                <p className="text-sm text-gray-300">Quick application process with direct employer connections</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#C89333" }}
                >
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Easy Search</h3>
                <p className="text-sm text-gray-300">Find the perfect role with our intuitive job search platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave - positioned at the bottom of the viewport */}
      <div className="relative bottom-0 left-0 right-0 overflow-hidden -mb-1">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
