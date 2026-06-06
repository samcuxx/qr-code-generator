import { ImageResponse } from "next/og"

import { siteConfig } from "@/lib/site"

export const alt = "QR Studio QR code generator preview"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background:
          "linear-gradient(135deg, #f5fbff 0%, #ffffff 52%, #e9f5ff 100%)",
        display: "flex",
        height: "100%",
        padding: "70px",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: "white",
          border: "1px solid #dbeafe",
          borderRadius: "54px",
          boxShadow: "0 36px 90px rgba(15, 23, 42, 0.12)",
          display: "flex",
          gap: "58px",
          height: "100%",
          padding: "58px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            width: "620px",
          }}
        >
          <div
            style={{
              alignItems: "center",
              color: "#148bf8",
              display: "flex",
              fontSize: "30px",
              fontWeight: 700,
              gap: "16px",
            }}
          >
            <div
              style={{
                background: "#148bf8",
                borderRadius: "16px",
                height: "48px",
                width: "48px",
              }}
            />
            {siteConfig.name}
          </div>
          <div
            style={{
              color: "#0f172a",
              display: "flex",
              flexDirection: "column",
              fontSize: "78px",
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1,
            }}
          >
            <span>Create clean</span>
            <span>QR codes.</span>
          </div>
          <div
            style={{
              color: "#475569",
              display: "flex",
              fontSize: "30px",
              lineHeight: 1.35,
              maxWidth: "560px",
            }}
          >
            Preview instantly and export production-ready PNG or SVG files.
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            background: "#f8fafc",
            border: "1px solid #cbd5e1",
            borderRadius: "44px",
            display: "flex",
            height: "330px",
            justifyContent: "center",
            width: "330px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "14px",
              height: "226px",
              width: "226px",
            }}
          >
            {Array.from({ length: 25 }).map((_, index) => (
              <div
                key={index}
                style={{
                  background: [
                    0, 1, 5, 6, 3, 4, 8, 9, 15, 16, 20, 21, 12, 18, 23,
                  ].includes(index)
                    ? "#0f172a"
                    : "transparent",
                  borderRadius: "9px",
                  height: "34px",
                  width: "34px",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>,
    size
  )
}
