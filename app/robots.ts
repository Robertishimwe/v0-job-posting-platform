import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/organization/", "/my-applications/", "/track-application/"],
      },
    ],
    sitemap: "https://www.elevatefinconsult.com/sitemap.xml",
  }
}
