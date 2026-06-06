import { ImageResponse } from "next/og"

export const size = {
  width: 512,
  height: 512,
}

export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#148bf8",
        borderRadius: "96px",
        color: "white",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "22px",
          height: "304px",
          width: "304px",
        }}
      >
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            style={{
              background: "white",
              borderRadius: "18px",
              height: "86px",
              width: "86px",
            }}
          />
        ))}
      </div>
    </div>,
    size
  )
}
