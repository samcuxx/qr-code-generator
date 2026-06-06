import { QrCodeGenerator } from "@/components/qr-code-generator"

export default function Page() {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-3">
          <div className="flex w-fit items-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-sm text-muted-foreground">
            Professional QR utility
          </div>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-medium tracking-normal text-foreground sm:text-4xl">
                Create clean QR codes in seconds.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                Generate a scannable QR code for links, messages, and contact
                details, then export it as PNG or SVG.
              </p>
            </div>
            <p className="text-sm leading-6 text-muted-foreground lg:text-right">
              Private by design: generation happens in your browser.
            </p>
          </div>
        </div>

        <QrCodeGenerator />
      </div>
    </main>
  )
}
