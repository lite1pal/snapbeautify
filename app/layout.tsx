import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], display: "swap" });

// Use environment variables or dynamically determine the base URL
const baseUrl = "https://snapbeautify.denistarasenko.com";

export const metadata: Metadata = {
  title: "SnapBeautify - Beautify Your Screenshots Instantly",
  description:
    "Transform your screenshots with beautiful backgrounds, perfect margins, and subtle shadows - all in just a few clicks. No signup required, free to use.",
  keywords: [
    "screenshot beautifier",
    "image enhancement",
    "screenshot tool",
    "design tool",
    "image editor",
    "screenshot background",
    "screenshot shadow",
    "screenshot margin",
    "free screenshot tool",
  ],
  authors: [{ name: "SnapBeautify" }],
  creator: "SnapBeautify",
  publisher: "SnapBeautify",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "SnapBeautify - Beautify Your Screenshots Instantly",
    description:
      "Transform your screenshots with beautiful backgrounds, perfect margins, and subtle shadows - all in just a few clicks.",
    url: baseUrl,
    siteName: "SnapBeautify",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SnapBeautify - Screenshot Beautifier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapBeautify - Beautify Your Screenshots Instantly",
    description:
      "Transform your screenshots with beautiful backgrounds, perfect margins, and subtle shadows - all in just a few clicks.",
    images: ["/og-image.png"],
    creator: "@snapbeautify",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
