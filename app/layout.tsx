import "./globals.css"
import { Inter } from "next/font/google"
import { AppProvider } from "@/contexts/AppContext"
import type { Metadata, Viewport } from "next"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

// (1) Separamos lo que antes estaba en metadata.viewport
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: 'resizes-visual'
}

// (2) Dejamos el resto de metadata como estaba
export const metadata: Metadata = {
  title: "Carga tus fichas",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Carga tus fichas",
  },
  icons: {
    icon: "https://firebasestorage.googleapis.com/v0/b/cargatusfichas2.firebasestorage.app/o/admin%2Ffavicon.png?alt=media&token=b5607c23-a39a-409d-ba88-64969459e739",
    shortcut:
      "https://firebasestorage.googleapis.com/v0/b/cargatusfichas2.firebasestorage.app/o/admin%2Ffavicon.png?alt=media&token=b5607c23-a39a-409d-ba88-64969459e739",
    apple:
      "https://firebasestorage.googleapis.com/v0/b/cargatusfichas2.firebasestorage.app/o/admin%2Ffavicon.png?alt=media&token=b5607c23-a39a-409d-ba88-64969459e739",
    other: {
      rel: "apple-touch-icon",
      url: "https://firebasestorage.googleapis.com/v0/b/cargatusfichas2.firebasestorage.app/o/admin%2Ffavicon.png?alt=media&token=b5607c23-a39a-409d-ba88-64969459e739",
    },
  },
}

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
           <body className={`${inter.className} bg-[#111b21]`}>
        <AppProvider>
          <RootLayoutContent>{children}</RootLayoutContent>
        </AppProvider>
      </body>
    </html>
  )
}

