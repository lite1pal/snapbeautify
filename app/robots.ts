import { MetadataRoute } from "next";

// Use environment variables or dynamically determine the base URL
const baseUrl = "https://snapbeautify.denistarasenko.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
