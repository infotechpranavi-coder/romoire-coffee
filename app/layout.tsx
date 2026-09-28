import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_Garamond, Outfit, Manrope } from 'next/font/google'
import './globals.css'
import { Toaster } from "../components/ui/toaster"
import { Toaster as Sonner } from "../components/ui/sonner"
import { TooltipProvider } from "../components/ui/tooltip"
import { InquiryFormProvider } from "../contexts/InquiryFormContext"
import { CategoryLabelsProvider } from "../contexts/CategoryLabelsContext"
import ConditionalLayout from "../components/ConditionalLayout"
import { SITE_NAME, SITE_DESCRIPTION, SITE_TAGLINE, LOGO_SRC } from "../lib/branding"

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Romoire',
  description: 'Romoire is a plant based cappuccino premix made with single origin Arabica, coconut milk and monk fruit. Dairy free, lactose free, vegan friendly and no refined sugar. One sachet, hot water, one minute.',
  icons: {
    icon: LOGO_SRC,
    apple: LOGO_SRC,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${cormorant.variable} ${outfit.variable} ${manrope.variable} font-body bg-white text-ink antialiased`}
        style={{
          ['--font-garet' as string]: 'var(--font-outfit)',
          ['--font-outfit' as string]: 'var(--font-outfit)',
        }}
        suppressHydrationWarning
      >
        <TooltipProvider>
          <CategoryLabelsProvider>
            <InquiryFormProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <Toaster />
              <Sonner />
            </InquiryFormProvider>
          </CategoryLabelsProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
