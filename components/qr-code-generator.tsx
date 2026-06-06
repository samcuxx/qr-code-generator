"use client"

import * as React from "react"
import {
  ArrowClockwiseIcon,
  CheckIcon,
  ClipboardIcon,
  DownloadSimpleIcon,
  QrCodeIcon,
} from "@phosphor-icons/react"
import QRCode, { type QRCodeErrorCorrectionLevel } from "qrcode"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type ErrorCorrectionOption = {
  value: QRCodeErrorCorrectionLevel
  label: string
  description: string
}

const ERROR_CORRECTION_OPTIONS: ErrorCorrectionOption[] = [
  { value: "L", label: "Low", description: "Smallest code" },
  { value: "M", label: "Medium", description: "Balanced" },
  { value: "Q", label: "Quartile", description: "More resilient" },
  { value: "H", label: "High", description: "Most resilient" },
]

const MAX_CHARACTERS = 1200

function downloadFile(contents: string, fileName: string, type: string) {
  const blob = new Blob([contents], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement("a")

  link.href = dataUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
}

function getSliderValue(
  nextValue: number | readonly number[],
  fallback: number
) {
  return Array.isArray(nextValue) ? (nextValue[0] ?? fallback) : nextValue
}

export function QrCodeGenerator() {
  const [value, setValue] = React.useState("")
  const [foreground, setForeground] = React.useState("#111111")
  const [background, setBackground] = React.useState("#ffffff")
  const [size, setSize] = React.useState(320)
  const [margin, setMargin] = React.useState(2)
  const [errorCorrection, setErrorCorrection] =
    React.useState<QRCodeErrorCorrectionLevel>("M")
  const [pngDataUrl, setPngDataUrl] = React.useState("")
  const [svgMarkup, setSvgMarkup] = React.useState("")
  const [generationError, setGenerationError] = React.useState("")
  const [copyState, setCopyState] = React.useState<
    "idle" | "copied" | "failed"
  >("idle")

  const trimmedValue = value.trim()
  const isTooLong = value.length > MAX_CHARACTERS
  const canExport = Boolean(
    trimmedValue && pngDataUrl && svgMarkup && !generationError
  )

  React.useEffect(() => {
    let isCurrent = true

    async function generateCode() {
      setCopyState("idle")

      if (!trimmedValue) {
        setPngDataUrl("")
        setSvgMarkup("")
        setGenerationError("")
        return
      }

      if (isTooLong) {
        setPngDataUrl("")
        setSvgMarkup("")
        setGenerationError(
          `Keep the QR content under ${MAX_CHARACTERS} characters.`
        )
        return
      }

      try {
        const options = {
          color: {
            dark: foreground,
            light: background,
          },
          errorCorrectionLevel: errorCorrection,
          margin,
          width: size,
        }
        const [nextPng, nextSvg] = await Promise.all([
          QRCode.toDataURL(trimmedValue, options),
          QRCode.toString(trimmedValue, { ...options, type: "svg" }),
        ])

        if (!isCurrent) {
          return
        }

        setPngDataUrl(nextPng)
        setSvgMarkup(nextSvg)
        setGenerationError("")
      } catch {
        if (isCurrent) {
          setPngDataUrl("")
          setSvgMarkup("")
          setGenerationError(
            "That content could not be encoded. Try a shorter value."
          )
        }
      }
    }

    generateCode()

    return () => {
      isCurrent = false
    }
  }, [
    background,
    errorCorrection,
    foreground,
    isTooLong,
    margin,
    size,
    trimmedValue,
  ])

  async function copyPngDataUrl() {
    if (!canExport) {
      return
    }

    try {
      await navigator.clipboard.writeText(pngDataUrl)
      setCopyState("copied")
    } catch {
      setCopyState("failed")
    }
  }

  function resetDefaults() {
    setForeground("#111111")
    setBackground("#ffffff")
    setSize(320)
    setMargin(2)
    setErrorCorrection("M")
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
      <Card className="rounded-lg">
        <CardHeader className="border-b">
          <CardTitle>QR details</CardTitle>
          <CardDescription>
            Add the content and adjust the output before exporting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="qr-value">Content</Label>
              <span
                className={cn(
                  "text-xs text-muted-foreground",
                  isTooLong && "text-destructive"
                )}
              >
                {value.length}/{MAX_CHARACTERS}
              </span>
            </div>
            <Textarea
              id="qr-value"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Paste a URL, message, email address, or any text..."
              className="min-h-36 resize-none leading-relaxed"
              aria-invalid={isTooLong || undefined}
            />
            {generationError ? (
              <p className="text-sm text-destructive">{generationError}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                QR codes work best with concise text or links.
              </p>
            )}
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="foreground">Foreground</Label>
              <div className="flex gap-2">
                <Input
                  id="foreground"
                  type="color"
                  value={foreground}
                  onChange={(event) => setForeground(event.target.value)}
                  className="h-9 w-12 shrink-0 p-1"
                  aria-label="Foreground color"
                />
                <Input
                  value={foreground}
                  onChange={(event) => setForeground(event.target.value)}
                  className="h-9 font-mono text-sm uppercase"
                  aria-label="Foreground hex value"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="background">Background</Label>
              <div className="flex gap-2">
                <Input
                  id="background"
                  type="color"
                  value={background}
                  onChange={(event) => setBackground(event.target.value)}
                  className="h-9 w-12 shrink-0 p-1"
                  aria-label="Background color"
                />
                <Input
                  value={background}
                  onChange={(event) => setBackground(event.target.value)}
                  className="h-9 font-mono text-sm uppercase"
                  aria-label="Background hex value"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="qr-size">Size</Label>
                <span className="font-mono text-xs text-muted-foreground">
                  {size}px
                </span>
              </div>
              <Slider
                id="qr-size"
                value={[size]}
                min={180}
                max={640}
                step={20}
                onValueChange={(nextValue) =>
                  setSize(getSliderValue(nextValue, 320))
                }
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="qr-margin">Margin</Label>
                <span className="font-mono text-xs text-muted-foreground">
                  {margin}
                </span>
              </div>
              <Slider
                id="qr-margin"
                value={[margin]}
                min={0}
                max={8}
                step={1}
                onValueChange={(nextValue) =>
                  setMargin(getSliderValue(nextValue, 2))
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="error-correction">Error correction</Label>
              <Select
                value={errorCorrection}
                onValueChange={(nextValue) =>
                  setErrorCorrection(nextValue as QRCodeErrorCorrectionLevel)
                }
              >
                <SelectTrigger id="error-correction" className="h-9 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger>
                  {ERROR_CORRECTION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={resetDefaults} className="h-9">
              <ArrowClockwiseIcon data-icon="inline-start" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader className="border-b">
          <CardTitle>Preview</CardTitle>
          <CardDescription>Export your QR code as PNG or SVG.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex aspect-square min-h-72 items-center justify-center rounded-lg border bg-[linear-gradient(45deg,var(--muted)_25%,transparent_25%),linear-gradient(-45deg,var(--muted)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,var(--muted)_75%),linear-gradient(-45deg,transparent_75%,var(--muted)_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0] p-5">
            {pngDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pngDataUrl}
                alt="Generated QR code preview"
                className="max-h-full max-w-full rounded-md shadow-sm"
              />
            ) : (
              <div className="flex max-w-56 flex-col items-center gap-3 text-center text-muted-foreground">
                <div className="flex size-12 items-center justify-center rounded-lg border bg-background">
                  <QrCodeIcon className="size-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Waiting for content
                  </p>
                  <p className="text-sm">
                    Enter text or a link to generate a scannable QR code.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!canExport}
                    onClick={copyPngDataUrl}
                    aria-label="Copy PNG data URL"
                  />
                }
              >
                {copyState === "copied" ? (
                  <CheckIcon data-icon="inline-start" />
                ) : (
                  <ClipboardIcon data-icon="inline-start" />
                )}
                Copy
              </TooltipTrigger>
              <TooltipContent>
                {copyState === "failed"
                  ? "Clipboard access was blocked"
                  : "Copy PNG data URL"}
              </TooltipContent>
            </Tooltip>
            <Button
              type="button"
              variant="outline"
              disabled={!canExport}
              onClick={() => downloadDataUrl(pngDataUrl, "qr-code.png")}
            >
              <DownloadSimpleIcon data-icon="inline-start" />
              PNG
            </Button>
            <Button
              type="button"
              disabled={!canExport}
              onClick={() =>
                downloadFile(svgMarkup, "qr-code.svg", "image/svg+xml")
              }
            >
              <DownloadSimpleIcon data-icon="inline-start" />
              SVG
            </Button>
          </div>

          {copyState === "copied" ? (
            <p className="text-center text-sm text-muted-foreground">
              PNG data URL copied to clipboard.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
