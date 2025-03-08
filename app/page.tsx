import { EditorLayout } from "@/components/editor-layout";
import { Hero } from "@/components/hero";
import { Metadata } from "next";
import Script from "next/script";

// Use environment variables or dynamically determine the base URL
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://snapbeautify.denistarasenko.com");

export const metadata: Metadata = {
  title: "SnapBeautify - Transform Your Screenshots Instantly",
  description:
    "Enhance your screenshots with beautiful backgrounds, perfect margins, and subtle shadows - all in just a few clicks.",
};

export default function Home() {
  return (
    <>
      <Script id="structured-data" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "SnapBeautify",
          description:
            "Transform your screenshots with beautiful backgrounds, perfect margins, and subtle shadows - all in just a few clicks.",
          url: baseUrl,
          applicationCategory: "DesignApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          featureList: [
            "Beautiful backgrounds",
            "Perfect margins",
            "Subtle shadows",
            "No signup required",
            "Free to use",
            "Instant results",
          ],
        })}
      </Script>
      <main className="min-h-screen bg-background flex justify-center items-center text-white">
        <Hero />
      </main>
    </>
  );
}
