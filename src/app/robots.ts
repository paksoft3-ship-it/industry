import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://cncotomasyon.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/hesap/", "/sepet", "/odeme", "/favoriler"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
