import { QrCodeGenerator } from "@/components/qr-code-generator"

export default function Page() {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium tracking-normal text-foreground sm:text-3xl">
            QR Code Generator
          </h1>
          <p className="text-sm text-muted-foreground">
            Create, customize, and export a clean QR code.
          </p>
        </div>

        <QrCodeGenerator />
      </div>
    </main>
  )
}
