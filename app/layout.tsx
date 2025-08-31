import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Providers from "@/components/providers"
import { cookieToWeb3AuthState } from "@web3auth/modal"
import { headers } from "next/headers"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
})

const sourceSansPro = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans-pro",
})

export const metadata: Metadata = {
  title: "Confiado - Debt Management",
  description: "Professional debt management and payment tracking",
  generator: "v0.app",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers();
  const web3authInitialState = cookieToWeb3AuthState(headersList.get('cookie'));
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${sourceSansPro.variable} ${playfairDisplay.variable} ${GeistMono.variable}`}>
        <Providers web3authInitialState={web3authInitialState}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Suspense fallback={null}>{children}</Suspense>
            <Toaster />
          </ThemeProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
