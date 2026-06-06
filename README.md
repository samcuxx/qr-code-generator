# QR Code Generator

A professional, lightweight QR code generator built with Next.js, React, Tailwind CSS, and shadcn/ui. Create clean QR codes for links or text, customize the output, and export production-ready PNG or SVG files directly from the browser.

## Features

- Live QR code preview as you type
- Text and URL support
- Foreground and background color controls
- Adjustable output size and margin
- Error correction levels: Low, Medium, Quartile, and High
- PNG and SVG export
- Copy PNG data URL to clipboard
- Responsive light/dark interface
- Client-side generation with no backend or data storage

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui with Base UI primitives
- Phosphor Icons
- qrcode

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Project Structure

```text
app/
  layout.tsx
  page.tsx
components/
  qr-code-generator.tsx
  ui/
lib/
  utils.ts
```

## Privacy

QR codes are generated entirely in the browser. The app does not send QR content to a server, store user input, or require an account.

## License

This project is private unless you choose to publish it with a license.
