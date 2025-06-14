import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Eneagrama - Fanny Torres Da Silva",
  description:
    "Descubre el poder del Eneagrama con Fanny Torres Da Silva. Cursos, certificaciones y recursos para tu desarrollo personal.",
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/imgs/favicon.ico' },
      { url: '/imgs/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/imgs/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/imgs/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/imgs/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/imgs/android-chrome-512x512.png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
