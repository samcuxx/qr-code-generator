export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get("domain")

  if (!domain || !/^[a-z0-9.-]+$/i.test(domain)) {
    return new Response(null, { status: 400 })
  }

  const candidates = [
    `https://${domain}/icon.png`,
    `https://${domain}/favicon.ico`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
      domain
    )}&sz=256`,
  ]

  for (const candidate of candidates) {
    const response = await fetch(candidate).catch(() => null)
    const contentType = response?.headers.get("content-type") ?? ""

    if (response?.ok && response.body && contentType.startsWith("image/")) {
      return new Response(response.body, {
        headers: {
          "Cache-Control":
            "public, max-age=86400, stale-while-revalidate=604800",
          "Content-Type": contentType,
        },
      })
    }
  }

  return new Response(
    `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="64" fill="#148BF8"/><text x="128" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="82" font-weight="900" fill="#fff">QR</text></svg>`,
    {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "Content-Type": "image/svg+xml",
      },
    }
  )
}
