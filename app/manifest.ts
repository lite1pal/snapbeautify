import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SnapBeautify - Screenshot Beautifier",
    short_name: "SnapBeautify",
    description:
      "Transform your screenshots with beautiful backgrounds, perfect margins, and subtle shadows",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#9333ea",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    orientation: "portrait",
    categories: ["design", "productivity", "utilities"],
    screenshots: [
      {
        src: "/screenshot1.jpg",
        sizes: "1280x720",
        type: "image/jpeg",
        label: "SnapBeautify Home Screen",
      },
      {
        src: "/screenshot2.jpg",
        sizes: "1280x720",
        type: "image/jpeg",
        label: "Screenshot Editor",
      },
    ],
  };
}
