import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SnapBeautify - Screenshot Beautifier";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #0f0f0f, #1a1a1a)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          padding: "40px",
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.15) 2px, transparent 0)",
            backgroundSize: "50px 50px",
            opacity: 0.4,
          }}
        />

        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            width: "200px",
            height: "200px",
            background: "linear-gradient(to bottom right, #9333ea, #ec4899)",
            borderRadius: "100%",
            filter: "blur(70px)",
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            width: "200px",
            height: "200px",
            background: "linear-gradient(to bottom right, #4f46e5, #9333ea)",
            borderRadius: "100%",
            filter: "blur(70px)",
            opacity: 0.6,
          }}
        />

        {/* Logo/Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 24px",
            background: "rgba(147, 51, 234, 0.1)",
            border: "1px solid rgba(147, 51, 234, 0.3)",
            borderRadius: "50px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              background: "linear-gradient(to bottom right, #9333ea, #ec4899)",
              borderRadius: "50%",
              marginRight: "12px",
            }}
          />
          <span
            style={{
              color: "#d8b4fe",
              fontSize: "24px",
              fontWeight: 600,
            }}
          >
            SnapBeautify
          </span>
        </div>

        {/* Main title */}
        <h1
          style={{
            fontSize: "72px",
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            margin: "0 0 24px 0",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          <span>Beautify Your</span>
          <br />
          <span
            style={{
              background: "linear-gradient(to right, #9333ea, #ec4899)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Screenshots
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "28px",
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: "700px",
            margin: "0 0 40px 0",
          }}
        >
          Transform your screenshots with beautiful backgrounds, perfect
          margins, and subtle shadows
        </p>

        {/* Before/After mockup */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              width: "250px",
              height: "150px",
              background: "#1f1f1f",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "8px",
                background: "#2d2d2d",
                fontSize: "14px",
                color: "#a1a1aa",
              }}
            >
              Before
            </div>
            <div
              style={{
                flex: 1,
                background: "#2d2d2d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "90%",
                  height: "80%",
                  background: "#3d3d3d",
                }}
              />
            </div>
          </div>

          <div
            style={{
              width: "250px",
              height: "150px",
              background: "rgba(147, 51, 234, 0.1)",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "8px",
                background: "rgba(147, 51, 234, 0.3)",
                fontSize: "14px",
                color: "#d8b4fe",
              }}
            >
              After
            </div>
            <div
              style={{
                flex: 1,
                background:
                  "linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.2))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
              }}
            >
              <div
                style={{
                  width: "90%",
                  height: "80%",
                  background: "#3d3d3d",
                  borderRadius: "8px",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
