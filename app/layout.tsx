// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400'],
  display: 'swap',
  style: ['normal', 'italic'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4F565B',
}

export const metadata: Metadata = {
  title: 'Pluma Joinery Studio — Custom Joinery Estimator',
  description: 'Get a guide price for your custom wardrobe, kitchen, TV unit or joinery project in Sydney. Instant estimate — no obligation.',
  keywords: 'custom joinery Sydney, wardrobe builder Sydney, kitchen joinery Paddington, Mosman joinery, Bondi custom cabinets',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Pluma Joinery Studio — Custom Joinery Estimator',
    description: 'Instant estimate for custom joinery in Sydney. Wardrobes, kitchens, TV units, bench seats and more.',
    url: 'https://www.plumajoinery.com',
    siteName: 'Pluma Joinery Studio',
    locale: 'en_AU',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body>{children}</body>
    </html>
  )
}
