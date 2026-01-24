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
    "Join Rwanda's leading financial consulting firm. Explore career opportunities and build your future with Elevate Fin Consult in Kigali.",
  generator: "Next.js",
  applicationName: "Elevate Fin Consult Careers",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Elevate Fin Consult",
    "Rwanda careers",
    "Kigali jobs",
    "financial consulting",
    "job portal Rwanda",
    "recruitment services",
  ],
  authors: [{ name: "Elevate Fin Consult", url: "https://www.elevatefinconsult.com" }],
  creator: "Elevate Fin Consult",
  publisher: "Elevate Fin Consult",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.elevatefinconsult.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/images/favicon-192x192.png",
    shortcut: "/favicon.ico",
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
    site: "@elevatefinconsult",
    creator: "@elevatefinconsult",
  },
  verification: {
    google: "your-google-verification-code-here",
  },
  category: "business",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://www.elevatefinconsult.com" />
        <meta name="theme-color" content="#1A0D66" />
      </head>
      <body className={`font-sans antialiased overflow-x-hidden`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
