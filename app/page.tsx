import Image from "next/image"

import { QrCodeGenerator } from "@/components/qr-code-generator"
import { getSiteUrl, siteConfig } from "@/lib/site"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteConfig.title,
  alternateName: siteConfig.name,
  url: getSiteUrl("/"),
  description: siteConfig.description,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Person",
    name: siteConfig.creator,
  },
}

export default function Page() {
  return (
    <main className="min-h-svh bg-[linear-gradient(180deg,#f4faff_0%,#ffffff_42%,#f8fafc_100%)] dark:bg-background dark:bg-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-4 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/mark.svg"
              alt=""
              width={40}
              height={40}
              priority
              className="size-10 rounded-2xl shadow-sm"
            />
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-primary">QR Studio</p>
              <h1 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
                QR Code Generator
              </h1>
            </div>
          </div>
          <div className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-sm">
            Private
          </div>
        </div>

        <QrCodeGenerator />
      </div>
    </main>
  )
}
