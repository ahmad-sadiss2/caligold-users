import type React from "react"
import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700", "800"], 
  variable: "--font-poppins",
  display: 'swap',
})

// Separate viewport export (NEW in Next.js 14+)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Optional: Add more viewport properties
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFD700' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

// Metadata export (viewport removed)
export const metadata: Metadata = {
  title: "CALI GOLD DRIVE - Premium Ride Service | Your Ride. Your Way. Always Gold.",
  description: "Premium ride service across Southern California. Airport transfers, events, errands - Pet friendly with no extra fees. Serving LA, OC, San Diego & Riverside.",
  generator: 'Next.js',
  keywords: ['ride service', 'premium transport', 'california', 'airport transfer', 'pet friendly'],
  authors: [{ name: 'CALI GOLD DRIVE' }],
  creator: 'CALI GOLD DRIVE',
  publisher: 'CALI GOLD DRIVE',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.caligolddrive.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/image1.png', sizes: 'any', type: 'image/png' },
    ],
    other: [
      { url: '/image1.png', sizes: 'any', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'CALI GOLD DRIVE - Premium Ride Service',
    description: 'Premium ride service across Southern California',
    url: 'https://www.caligolddrive.com',
    siteName: 'CALI GOLD DRIVE',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/image1.png',
        width: 512,
        height: 512,
        alt: 'CALI GOLD DRIVE Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CALI GOLD DRIVE - Premium Ride Service',
    description: 'Premium ride service across Southern California',
    creator: '@caligolddrive',
    images: ['/image1.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/image1.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${poppins.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}