"use client";

import { useState } from "react";
import { Sparkles, Upload, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative overflow-hidden py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Left column: Text content */}
          <div className="flex max-w-[500px] w-fit flex-col space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-300">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                <span>Screenshot Beautifier</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                Transform your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                  screenshots
                </span>{" "}
                into stunning visuals
              </h1>

              <p className="text-xl text-gray-400 max-w-[500px]">
                Instantly enhance your screenshots with beautiful backgrounds,
                perfect margins, and subtle shadows - all in just a few clicks.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/editor">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium group"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Screenshot
                  <span
                    className={`ml-1 inline-flex transition-transform duration-200 ${
                      isHovered ? "translate-x-1" : ""
                    }`}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded-full bg-green-500" />
                No signup required
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded-full bg-green-500" />
                Free to use
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded-full bg-green-500" />
                Instant results
              </div>
            </div>
          </div>

          {/* Right column: Preview image */}
          <div className="relative lg:w-[900px]">
            <Image
              src="/before-after.png"
              alt="Screenshot"
              width={1920}
              height={1080}
              quality={100}
              className="object-contain h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
