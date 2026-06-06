export const siteConfig = {
  name: "QR Studio",
  title: "QR Code Generator",
  description:
    "Create clean, customizable QR codes for links and text. Preview instantly and export as PNG or SVG.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://qrcodegenerator.samcux.com",
  creator: "samcuxx",
  keywords: [
    "QR code generator",
    "free QR code generator",
    "custom QR code",
    "QR code maker",
    "SVG QR code",
    "PNG QR code",
    "online QR code generator",
  ],
}

export function getSiteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString()
}
