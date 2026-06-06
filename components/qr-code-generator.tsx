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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  const [sampleQrDataUrl, setSampleQrDataUrl] = React.useState("")

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

  React.useEffect(() => {
    let isCurrent = true

    QRCode.toDataURL("QR Studio", {
      color: {
        dark: "#111111",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
      margin: 1,
      width: 240,
    })
      .then((dataUrl) => {
        if (isCurrent) {
          setSampleQrDataUrl(dataUrl)
        }
      })
      .catch(() => undefined)

    return () => {
      isCurrent = false
    }
  }, [])

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
    <div className="grid gap-3 lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)] lg:items-start">
      <Card
        size="sm"
        className="rounded-2xl border-white/70 bg-white/90 shadow-xl ring-0 shadow-slate-200/50 backdrop-blur lg:sticky lg:top-5 dark:border-border dark:bg-card dark:shadow-none"
      >
        <CardHeader className="border-b pb-3">
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative flex aspect-[1.02] min-h-56 items-center justify-center overflow-hidden rounded-2xl border bg-[linear-gradient(180deg,#eef7ff_0%,#ffffff_62%,#f8fafc_100%)] p-4 sm:min-h-72 dark:bg-card dark:bg-none">
            {pngDataUrl ? (
              <div className="flex aspect-square w-[88%] max-w-72 items-center justify-center rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 sm:p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pngDataUrl}
                  alt="Generated QR code preview"
                  className="h-full w-full rounded-md object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative">
                  <div className="absolute top-8 -left-10 rounded-full border bg-white/95 px-3 py-1 text-[0.65rem] font-medium text-muted-foreground shadow-sm dark:bg-card">
                    LINK
                  </div>
                  <div className="absolute -right-10 bottom-8 rounded-full border bg-white/95 px-3 py-1 text-[0.65rem] font-medium text-muted-foreground shadow-sm dark:bg-card">
                    TEXT
                  </div>
                  <div className="rounded-2xl bg-white p-5 shadow-xl ring-1 shadow-blue-100/70 ring-slate-200 dark:shadow-none">
                    {sampleQrDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={sampleQrDataUrl}
                        alt=""
                        className="size-36 rounded-md sm:size-44"
                      />
                    ) : (
                      <QrCodeIcon className="size-28 text-foreground" />
                    )}
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground">
                  Create QR Codes
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-[2.5rem_1fr_1fr] gap-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!canExport}
                    onClick={copyPngDataUrl}
                    aria-label="Copy PNG data URL"
                    className="h-10 rounded-xl"
                  />
                }
              >
                {copyState === "copied" ? <CheckIcon /> : <ClipboardIcon />}
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
              className="h-10 rounded-xl"
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
              className="h-10 rounded-xl shadow-sm"
            >
              <DownloadSimpleIcon data-icon="inline-start" />
              SVG
            </Button>
          </div>

          {copyState === "copied" ? (
            <p className="text-center text-sm text-muted-foreground">Copied.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card
        size="sm"
        className="rounded-2xl border-white/70 bg-white/90 shadow-xl ring-0 shadow-slate-200/50 backdrop-blur dark:border-border dark:bg-card dark:shadow-none"
      >
        <CardHeader className="border-b pb-3">
          <CardTitle>Create</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              placeholder="Enter your text..."
              className="min-h-16 resize-none rounded-2xl border-transparent bg-muted/70 leading-relaxed shadow-inner focus-visible:border-primary/40 sm:min-h-20"
              aria-invalid={isTooLong || undefined}
            />
            {generationError ? (
              <p className="text-sm text-destructive">{generationError}</p>
            ) : null}
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Colors</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetDefaults}
                className="h-7 rounded-full px-2"
              >
                <ArrowClockwiseIcon data-icon="inline-start" />
                Reset
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="foreground">Foreground</Label>
                <div className="flex gap-2">
                  <Input
                    id="foreground"
                    type="color"
                    value={foreground}
                    onChange={(event) => setForeground(event.target.value)}
                    className="h-9 w-12 shrink-0 rounded-xl p-1"
                    aria-label="Foreground color"
                  />
                  <Input
                    value={foreground}
                    onChange={(event) => setForeground(event.target.value)}
                    className="h-9 rounded-xl bg-muted/60 font-mono text-sm uppercase"
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
                    className="h-9 w-12 shrink-0 rounded-xl p-1"
                    aria-label="Background color"
                  />
                  <Input
                    value={background}
                    onChange={(event) => setBackground(event.target.value)}
                    className="h-9 rounded-xl bg-muted/60 font-mono text-sm uppercase"
                    aria-label="Background hex value"
                  />
                </div>
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

          <div className="space-y-2">
            <Label htmlFor="error-correction">Correction</Label>
            <Select
              value={errorCorrection}
              onValueChange={(nextValue) =>
                setErrorCorrection(nextValue as QRCodeErrorCorrectionLevel)
              }
            >
              <SelectTrigger
                id="error-correction"
                className="h-9 w-full rounded-xl bg-muted/60"
              >
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
        </CardContent>
      </Card>
    </div>
  )
}
