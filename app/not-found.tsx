import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold" style={{ color: "#1A0D66" }}>
          404
        </h1>
        <h2 className="text-2xl font-semibold" style={{ color: "#1A0D66" }}>
          Page Not Found
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button style={{ backgroundColor: "#C89333", color: "white" }}>
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
