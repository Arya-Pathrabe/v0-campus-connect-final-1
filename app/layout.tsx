import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { FloatingAIAssistant } from "@/components/chat/floating-ai-assistant"
import "./globals.css"

export const metadata: Metadata = {
  title: "CampusConnect - Suryodaya College Platform",
  description:
    "Educational platform for students, teachers, and alumni of Suryodaya College of Engineering & Technology",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <FloatingAIAssistant />
        <Analytics />
      </body>
    </html>
  )
}
