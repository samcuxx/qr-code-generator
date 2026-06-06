import { ImageResponse } from "next/og"

export const size = {
  width: 180,
  height: 180,
}

export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#148bf8",
        borderRadius: "38px",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "28px",
          display: "flex",
          height: "112px",
          padding: "18px",
          width: "112px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "9px",
            height: "76px",
            width: "100%",
          }}
        >
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              style={{
                background: "#0f172a",
                borderRadius: "5px",
                height: "20px",
                width: "20px",
              }}
            />
          ))}
        </div>
      </div>
    </div>,
    size
  )
}
