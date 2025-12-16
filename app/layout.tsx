import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Careers - Elevate Fin Consult",
    template: "%s | Elevate Fin Consult",
  },
  description:
    "Join Rwanda's leading financial consulting firm. Explore career opportunities and build your future with Elevate Fin Consult.",
  generator: "v0.app",
  metadataBase: new URL("https://www.elevatefinconsult.com"),
  icons: {
    icon: [{ url: "/images/untitled-design-removebg-preview.png", type: "image/png" }],
    apple: "/images/untitled-design-removebg-preview.png",
  },
  openGraph: {
    title: "Careers - Elevate Fin Consult",
    description:
      "Join Rwanda's leading financial consulting firm. Explore career opportunities and build your future with Elevate Fin Consult.",
    url: "https://www.elevatefinconsult.com",
    siteName: "Elevate Fin Consult Careers",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/untitled-design-removebg-preview.png",
        width: 1200,
        height: 630,
        alt: "Elevate Fin Consult",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers - Elevate Fin Consult",
    description:
      "Join Rwanda's leading financial consulting firm. Explore career opportunities and build your future with Elevate Fin Consult.",
  },
  verification: {
    google: "your-google-verification-code-here",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased overflow-x-hidden`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
