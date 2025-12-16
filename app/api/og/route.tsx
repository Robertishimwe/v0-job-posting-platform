import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get("title") || "Job Opening"
  const company = searchParams.get("company") || "Elevate Fin Consult"
  const location = searchParams.get("location") || "Kigali, Rwanda"
  const type = searchParams.get("type") || "Full-time"

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1e1b4b",
        backgroundImage: "linear-gradient(to bottom right, #1e1b4b, #312e81)",
        padding: "80px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          borderRadius: "24px",
          padding: "60px",
          width: "100%",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <svg width="80" height="80" viewBox="0 0 200 200" fill="none">
            <rect x="20" y="20" width="50" height="160" rx="8" fill="#D97706" />
            <rect x="80" y="60" width="50" height="120" rx="8" fill="#D97706" />
            <rect x="140" y="100" width="50" height="80" rx="8" fill="#D97706" />
            <rect x="50" y="80" width="30" height="30" rx="4" fill="#1e1b4b" />
          </svg>
        </div>

        <div
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            color: "#1e1b4b",
            textAlign: "center",
            marginBottom: "24px",
            lineHeight: 1.2,
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "36px",
            color: "#D97706",
            fontWeight: "600",
            marginBottom: "32px",
          }}
        >
          {company}
        </div>

        <div
          style={{
            display: "flex",
            gap: "40px",
            fontSize: "28px",
            color: "#64748b",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#D97706">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            {location}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#D97706">
              <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
            </svg>
            {type}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "40px",
          fontSize: "28px",
          color: "white",
          fontWeight: "500",
        }}
      >
        Elevate Fin Consult - Expertise in Every Decision
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
